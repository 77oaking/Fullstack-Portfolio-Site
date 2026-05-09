import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import type { CvPersonal } from '../../schema/cv-personal.schema';
import type { CvSummary } from '../../schema/cv-summary.schema';
import type { ExperienceDoc } from '../../schema/experience.schema';
import type { EducationDoc } from '../../schema/education.schema';
import type { Skill } from '../../schema/skill.schema';
import type { Language } from '../../schema/language.schema';
import type { CertificationDoc } from '../../schema/certification.schema';
import type { Award } from '../../schema/award.schema';
import type { CvReference } from '../../schema/cv-reference.schema';

type ParsedCv = {
  personal: Partial<Record<string, unknown>>;
  summary: { text: string };
  experience: Array<Record<string, unknown>>;
  education: Array<Record<string, unknown>>;
  skills: Array<Record<string, unknown>>;
  languages: Array<Record<string, unknown>>;
  certifications: Array<Record<string, unknown>>;
  awards: Array<Record<string, unknown>>;
  references: Array<Record<string, unknown>>;
};

type ParserEngine = 'basic' | 'ollama';

@Injectable()
export class CvImportService {
  constructor(
    @InjectModel('CvPersonal') private readonly personalModel: Model<CvPersonal>,
    @InjectModel('CvSummary') private readonly summaryModel: Model<CvSummary>,
    @InjectModel('Experience') private readonly experienceModel: Model<ExperienceDoc>,
    @InjectModel('Education') private readonly educationModel: Model<EducationDoc>,
    @InjectModel('Skill') private readonly skillModel: Model<Skill>,
    @InjectModel('Language') private readonly languageModel: Model<Language>,
    @InjectModel('Certification') private readonly certificationModel: Model<CertificationDoc>,
    @InjectModel('Award') private readonly awardModel: Model<Award>,
    @InjectModel('CvReference') private readonly referenceModel: Model<CvReference>,
  ) {}

  async parseWithEngine(text: string, parserEngine: ParserEngine): Promise<ResponsePayload> {
    const cleaned = text.trim();
    if (!cleaned) return { success: true, data: this.parse(''), message: 'Empty text provided' };

    if (parserEngine === 'ollama') {
      const ollamaParsed = await this.parseWithOllama(cleaned);
      if (ollamaParsed) {
        return { success: true, data: ollamaParsed, message: 'Parsed with Ollama', count: 1 };
      }
      return {
        success: true,
        data: this.parse(cleaned),
        message: 'Ollama unavailable/unparseable response. Fell back to basic parser.',
        count: 1,
      };
    }

    return { success: true, data: this.parse(cleaned), message: 'Parsed with basic parser', count: 1 };
  }

  parse(text: string): ParsedCv {
    const cleaned = text.replace(/\r/g, '').trim();
    const lines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean);
    const lower = cleaned.toLowerCase();

    const email = cleaned.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? '';
    const phone = cleaned.match(/(\+\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{6,}/)?.[0]?.trim() ?? '';
    const linkedin = cleaned.match(/https?:\/\/[^\s]*linkedin\.com\/[^\s]*/i)?.[0] ?? '';
    const github = cleaned.match(/https?:\/\/[^\s]*github\.com\/[^\s]*/i)?.[0] ?? '';
    const website = cleaned.match(/https?:\/\/(?![^\s]*(linkedin|github)\.com)[^\s]+/i)?.[0] ?? '';

    const nameLine = lines[0] ?? '';
    const nameParts = nameLine.split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] ?? '';
    const lastName = nameParts.slice(1).join(' ');

    const probableHeadline = lines.find((l, i) => i > 0 && i < 5 && !/@/.test(l) && l.length > 6) ?? '';

    const summarySection = this.extractSection(cleaned, ['summary', 'profile', 'objective'], [
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'awards',
      'references',
    ]);

    const skillsText = this.extractSection(cleaned, ['skills', 'technical skills', 'competencies'], [
      'experience',
      'education',
      'projects',
      'certifications',
      'awards',
      'references',
    ]);
    const rawSkills = skillsText
      .split(/[\n,|]/)
      .map((s) => s.trim().replace(/^[-*]\s*/, ''))
      .filter((s) => s.length > 1 && s.length < 50);
    const dedupSkills = [...new Set(rawSkills.map((s) => s.toLowerCase()))].map((k, idx) => {
      const label = rawSkills.find((s) => s.toLowerCase() === k) ?? k;
      return {
        name: label,
        category: 'General',
        level: 3,
        yearsOfExperience: 0,
        icon: null,
        order: idx,
        visible: true,
      };
    });

    const languageSection = this.extractSection(cleaned, ['languages'], [
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'awards',
      'references',
    ]);
    const languages = languageSection
      .split(/[\n,]/)
      .map((s) => s.trim().replace(/^[-*]\s*/, ''))
      .filter((s) => s.length > 1 && s.length < 40)
      .map((name, idx) => ({
        name,
        proficiency: 'intermediate',
        order: idx,
      }));

    const dateRegex = /(20\d{2}|19\d{2})/;
    const experienceSection = this.extractSection(cleaned, ['experience', 'work experience', 'employment'], [
      'education',
      'skills',
      'projects',
      'certifications',
      'awards',
      'references',
    ]);
    const experience = experienceSection
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/^[-*]/.test(l))
      .slice(0, 8)
      .map((line, idx) => ({
        role: line.split(' at ')[0]?.slice(0, 80) || `Role ${idx + 1}`,
        company: line.split(' at ')[1]?.slice(0, 80) || 'Company',
        location: '',
        startDate: dateRegex.test(line) ? new Date(line.match(dateRegex)?.[0] + '-01-01') : new Date(),
        endDate: null,
        summary: line.slice(0, 250),
        bullets: [],
        techStack: [],
        order: idx,
        visible: true,
      }));

    const educationSection = this.extractSection(cleaned, ['education', 'academic background'], [
      'experience',
      'skills',
      'projects',
      'certifications',
      'awards',
      'references',
    ]);
    const education = educationSection
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/^[-*]/.test(l))
      .slice(0, 6)
      .map((line, idx) => ({
        institution: line.slice(0, 100),
        degree: 'Degree',
        fieldOfStudy: '',
        startDate: new Date(),
        endDate: null,
        current: false,
        grade: null,
        description: null,
        order: idx,
        visible: true,
      }));

    const certifications = this.extractSimpleEntries(cleaned, ['certifications', 'certificates'], 6).map((name, idx) => ({
      name,
      issuer: 'Issuer',
      issueDate: new Date(),
      expiryDate: null,
      credentialId: null,
      credentialUrl: null,
      order: idx,
      visible: true,
    }));

    const awards = this.extractSimpleEntries(cleaned, ['awards', 'achievements', 'honors'], 6).map((title, idx) => ({
      title,
      issuer: 'Issuer',
      date: new Date(),
      description: null,
      order: idx,
      visible: true,
    }));

    const references = this.extractSimpleEntries(cleaned, ['references'], 6).map((name, idx) => ({
      name,
      position: 'Reference',
      company: '',
      email: null,
      phone: null,
      relationship: null,
      order: idx,
      visible: true,
    }));

    return {
      personal: {
        firstName,
        lastName,
        headline: probableHeadline,
        email,
        phone,
        city: '',
        country: '',
        address: '',
        website: website || null,
        linkedin: linkedin || null,
        github: github || null,
        photo: null,
      },
      summary: { text: summarySection.slice(0, 3000) || (lower.includes('summary') ? '' : cleaned.slice(0, 600)) },
      experience,
      education,
      skills: dedupSkills,
      languages,
      certifications,
      awards,
      references,
    };
  }

  async apply(
    text: string,
    mode: 'replace' | 'merge' = 'replace',
    parserEngine: ParserEngine = 'basic',
  ): Promise<ResponsePayload> {
    const parsed = parserEngine === 'ollama'
      ? ((await this.parseWithOllama(text)) ?? this.parse(text))
      : this.parse(text);

    if (mode === 'replace') {
      await this.personalModel.findOneAndUpdate({}, { $set: parsed.personal }, { upsert: true, new: true });
      await this.summaryModel.findOneAndUpdate({}, { $set: parsed.summary }, { upsert: true, new: true });

      await Promise.all([
        this.experienceModel.deleteMany({}),
        this.educationModel.deleteMany({}),
        this.skillModel.deleteMany({}),
        this.languageModel.deleteMany({}),
        this.certificationModel.deleteMany({}),
        this.awardModel.deleteMany({}),
        this.referenceModel.deleteMany({}),
      ]);

      if (parsed.experience.length) await this.experienceModel.insertMany(parsed.experience);
      if (parsed.education.length) await this.educationModel.insertMany(parsed.education);
      if (parsed.skills.length) await this.skillModel.insertMany(parsed.skills);
      if (parsed.languages.length) await this.languageModel.insertMany(parsed.languages);
      if (parsed.certifications.length) await this.certificationModel.insertMany(parsed.certifications);
      if (parsed.awards.length) await this.awardModel.insertMany(parsed.awards);
      if (parsed.references.length) await this.referenceModel.insertMany(parsed.references);
    } else {
      await this.mergeSingletons(parsed);
      await this.mergeCollection(this.experienceModel, parsed.experience, (x) => `${x.role}|${x.company}`);
      await this.mergeCollection(this.educationModel, parsed.education, (x) => `${x.institution}|${x.degree}`);
      await this.mergeCollection(this.skillModel, parsed.skills, (x) => `${x.name}`.toLowerCase());
      await this.mergeCollection(this.languageModel, parsed.languages, (x) => `${x.name}`.toLowerCase());
      await this.mergeCollection(this.certificationModel, parsed.certifications, (x) => `${x.name}|${x.issuer}`);
      await this.mergeCollection(this.awardModel, parsed.awards, (x) => `${x.title}|${x.issuer}`);
      await this.mergeCollection(this.referenceModel, parsed.references, (x) => `${x.name}|${x.company}`);
    }

    return {
      success: true,
      message: `CV data imported successfully (${mode} mode, parser: ${parserEngine})`,
      data: {
        counts: {
          experience: parsed.experience.length,
          education: parsed.education.length,
          skills: parsed.skills.length,
          languages: parsed.languages.length,
          certifications: parsed.certifications.length,
          awards: parsed.awards.length,
          references: parsed.references.length,
        },
      },
    };
  }

  private async mergeSingletons(parsed: ParsedCv): Promise<void> {
    const personal = await this.personalModel.findOne().lean();
    const mergedPersonal = { ...(personal ?? {}) } as Record<string, unknown>;
    for (const [key, value] of Object.entries(parsed.personal)) {
      const current = mergedPersonal[key];
      const hasCurrent = !(current === null || current === undefined || current === '');
      const hasIncoming = !(value === null || value === undefined || value === '');
      if (!hasCurrent && hasIncoming) mergedPersonal[key] = value;
    }
    await this.personalModel.findOneAndUpdate({}, { $set: mergedPersonal }, { upsert: true, new: true });

    const summary = await this.summaryModel.findOne().lean();
    const currentSummary = (summary?.text ?? '').trim();
    const incomingSummary = (parsed.summary.text ?? '').trim();
    await this.summaryModel.findOneAndUpdate(
      {},
      { $set: { text: currentSummary || incomingSummary } },
      { upsert: true, new: true },
    );
  }

  private async mergeCollection<T extends Record<string, unknown>>(
    model: Model<any>,
    incoming: Array<Record<string, unknown>>,
    keyFn: (item: Record<string, unknown>) => string,
  ): Promise<void> {
    if (!incoming.length) return;
    const existing = (await model.find().lean()) as T[];
    const byKey = new Map<string, Record<string, unknown>>();
    for (const item of existing) {
      byKey.set(keyFn(item), item);
    }
    for (const item of incoming) {
      const key = keyFn(item);
      if (!byKey.has(key)) byKey.set(key, item);
    }
    const merged = [...byKey.values()].map((item, idx) => ({ ...item, order: idx }));
    await model.deleteMany({});
    if (merged.length) await model.insertMany(merged);
  }

  private async parseWithOllama(text: string): Promise<ParsedCv | null> {
    try {
      const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
      const candidates = process.env.OLLAMA_MODEL
        ? [process.env.OLLAMA_MODEL]
        : ['llama3.2:latest', 'llama3.1:8b', 'llama3:latest'];

      const prompt = [
        'You are a resume parser. Return ONLY strict JSON, no markdown.',
        'Schema:',
        '{"personal":{},"summary":{"text":""},"experience":[],"education":[],"skills":[],"languages":[],"certifications":[],"awards":[],"references":[]}',
        'Populate best-effort fields for a CV system. Use arrays for list sections.',
        'Keep keys exactly as schema above.',
        'Resume text:',
        text,
      ].join('\n');

      for (const model of candidates) {
        const res = await fetch(`${baseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt,
            stream: false,
            format: 'json',
          }),
        });
        if (!res.ok) continue;
        const payload = (await res.json()) as { response?: string };
        const raw = payload.response?.trim();
        if (!raw) continue;
        const parsed = JSON.parse(raw) as Partial<ParsedCv>;
        return this.normalizeParsed(parsed);
      }
      return null;
    } catch {
      return null;
    }
  }

  private normalizeParsed(input: Partial<ParsedCv>): ParsedCv {
    return {
      personal: (input.personal ?? {}) as Partial<Record<string, unknown>>,
      summary: { text: String(input.summary?.text ?? '') },
      experience: Array.isArray(input.experience) ? input.experience : [],
      education: Array.isArray(input.education) ? input.education : [],
      skills: Array.isArray(input.skills) ? input.skills : [],
      languages: Array.isArray(input.languages) ? input.languages : [],
      certifications: Array.isArray(input.certifications) ? input.certifications : [],
      awards: Array.isArray(input.awards) ? input.awards : [],
      references: Array.isArray(input.references) ? input.references : [],
    };
  }

  private extractSection(text: string, starts: string[], ends: string[]): string {
    const lines = text.split('\n');
    const lowerLines = lines.map((l) => l.toLowerCase().trim());
    let startIdx = -1;
    let endIdx = lines.length;

    for (let i = 0; i < lowerLines.length; i += 1) {
      if (starts.some((k) => lowerLines[i] === k || lowerLines[i].startsWith(`${k}:`))) {
        startIdx = i + 1;
        break;
      }
    }
    if (startIdx === -1) return '';

    for (let i = startIdx; i < lowerLines.length; i += 1) {
      if (ends.some((k) => lowerLines[i] === k || lowerLines[i].startsWith(`${k}:`))) {
        endIdx = i;
        break;
      }
    }
    return lines.slice(startIdx, endIdx).join('\n').trim();
  }

  private extractSimpleEntries(text: string, starts: string[], limit: number): string[] {
    const section = this.extractSection(text, starts, ['experience', 'education', 'skills', 'projects', 'references']);
    if (!section) return [];
    return section
      .split('\n')
      .map((l) => l.trim().replace(/^[-*]\s*/, ''))
      .filter((l) => l.length > 2)
      .slice(0, limit);
  }
}
