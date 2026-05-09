import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Award,
  Certification,
  CvReference,
  CvSummary,
  Education,
  Experience,
  Language,
  PersonalData,
  ResponsePayload,
  Skill,
} from '@portfolio/shared-types';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CvService {
  private readonly base = `${environment.apiBaseLink}/api/v1`;

  constructor(private readonly http: HttpClient) {}

  parseResume(
    text: string,
    sourceType: 'text' | 'pdf' | 'docx' | 'image' = 'text',
    parserEngine: 'basic' | 'ollama' = 'basic',
  ): Observable<ResponsePayload<unknown>> {
    return this.http.post<ResponsePayload<unknown>>(`${this.base}/cv/import/parse`, { text, sourceType, parserEngine });
  }

  applyResume(
    text: string,
    mode: 'replace' | 'merge' = 'replace',
    parserEngine: 'basic' | 'ollama' = 'basic',
  ): Observable<ResponsePayload<unknown>> {
    return this.http.post<ResponsePayload<unknown>>(`${this.base}/cv/import/apply`, { text, mode, parserEngine });
  }

  // ── Personal Data (singleton) ──────────────────────────────────────────

  getPersonal(): Observable<ResponsePayload<PersonalData>> {
    return this.http.get<ResponsePayload<PersonalData>>(`${this.base}/cv/personal`);
  }

  updatePersonal(data: Partial<PersonalData>): Observable<ResponsePayload<PersonalData>> {
    return this.http.put<ResponsePayload<PersonalData>>(`${this.base}/cv/personal`, data);
  }

  // ── Summary (singleton) ────────────────────────────────────────────────

  getSummary(): Observable<ResponsePayload<CvSummary>> {
    return this.http.get<ResponsePayload<CvSummary>>(`${this.base}/cv/summary`);
  }

  updateSummary(text: string): Observable<ResponsePayload<CvSummary>> {
    return this.http.put<ResponsePayload<CvSummary>>(`${this.base}/cv/summary`, { text });
  }

  // ── Experience ─────────────────────────────────────────────────────────

  getExperiences(): Observable<ResponsePayload<Experience[]>> {
    return this.http.get<ResponsePayload<Experience[]>>(`${this.base}/experience/admin/all`);
  }

  getExperienceById(id: string): Observable<ResponsePayload<Experience>> {
    return this.http.get<ResponsePayload<Experience>>(`${this.base}/experience/${id}`);
  }

  createExperience(data: Partial<Experience>): Observable<ResponsePayload<Experience>> {
    return this.http.post<ResponsePayload<Experience>>(`${this.base}/experience`, data);
  }

  updateExperience(id: string, data: Partial<Experience>): Observable<ResponsePayload<Experience>> {
    return this.http.put<ResponsePayload<Experience>>(`${this.base}/experience/${id}`, data);
  }

  removeExperience(id: string): Observable<ResponsePayload<void>> {
    return this.http.delete<ResponsePayload<void>>(`${this.base}/experience/${id}`);
  }

  // ── Education ──────────────────────────────────────────────────────────

  getEducations(): Observable<ResponsePayload<Education[]>> {
    return this.http.get<ResponsePayload<Education[]>>(`${this.base}/education/admin/all`);
  }

  getEducationById(id: string): Observable<ResponsePayload<Education>> {
    return this.http.get<ResponsePayload<Education>>(`${this.base}/education/${id}`);
  }

  createEducation(data: Partial<Education>): Observable<ResponsePayload<Education>> {
    return this.http.post<ResponsePayload<Education>>(`${this.base}/education`, data);
  }

  updateEducation(id: string, data: Partial<Education>): Observable<ResponsePayload<Education>> {
    return this.http.put<ResponsePayload<Education>>(`${this.base}/education/${id}`, data);
  }

  removeEducation(id: string): Observable<ResponsePayload<void>> {
    return this.http.delete<ResponsePayload<void>>(`${this.base}/education/${id}`);
  }

  // ── Skills ─────────────────────────────────────────────────────────────

  getSkills(): Observable<ResponsePayload<Skill[]>> {
    return this.http.get<ResponsePayload<Skill[]>>(`${this.base}/skills/admin/all`);
  }

  getSkillById(id: string): Observable<ResponsePayload<Skill>> {
    return this.http.get<ResponsePayload<Skill>>(`${this.base}/skills/${id}`);
  }

  createSkill(data: Partial<Skill>): Observable<ResponsePayload<Skill>> {
    return this.http.post<ResponsePayload<Skill>>(`${this.base}/skills`, data);
  }

  updateSkill(id: string, data: Partial<Skill>): Observable<ResponsePayload<Skill>> {
    return this.http.put<ResponsePayload<Skill>>(`${this.base}/skills/${id}`, data);
  }

  removeSkill(id: string): Observable<ResponsePayload<void>> {
    return this.http.delete<ResponsePayload<void>>(`${this.base}/skills/${id}`);
  }

  // ── Languages ──────────────────────────────────────────────────────────

  getLanguages(): Observable<ResponsePayload<Language[]>> {
    return this.http.get<ResponsePayload<Language[]>>(`${this.base}/languages/admin/all`);
  }

  getLanguageById(id: string): Observable<ResponsePayload<Language>> {
    return this.http.get<ResponsePayload<Language>>(`${this.base}/languages/${id}`);
  }

  createLanguage(data: Partial<Language>): Observable<ResponsePayload<Language>> {
    return this.http.post<ResponsePayload<Language>>(`${this.base}/languages`, data);
  }

  updateLanguage(id: string, data: Partial<Language>): Observable<ResponsePayload<Language>> {
    return this.http.put<ResponsePayload<Language>>(`${this.base}/languages/${id}`, data);
  }

  removeLanguage(id: string): Observable<ResponsePayload<void>> {
    return this.http.delete<ResponsePayload<void>>(`${this.base}/languages/${id}`);
  }

  // ── Certifications ─────────────────────────────────────────────────────

  getCertifications(): Observable<ResponsePayload<Certification[]>> {
    return this.http.get<ResponsePayload<Certification[]>>(`${this.base}/certifications/admin/all`);
  }

  getCertificationById(id: string): Observable<ResponsePayload<Certification>> {
    return this.http.get<ResponsePayload<Certification>>(`${this.base}/certifications/${id}`);
  }

  createCertification(data: Partial<Certification>): Observable<ResponsePayload<Certification>> {
    return this.http.post<ResponsePayload<Certification>>(`${this.base}/certifications`, data);
  }

  updateCertification(
    id: string,
    data: Partial<Certification>,
  ): Observable<ResponsePayload<Certification>> {
    return this.http.put<ResponsePayload<Certification>>(`${this.base}/certifications/${id}`, data);
  }

  removeCertification(id: string): Observable<ResponsePayload<void>> {
    return this.http.delete<ResponsePayload<void>>(`${this.base}/certifications/${id}`);
  }

  // ── Awards ─────────────────────────────────────────────────────────────

  getAwards(): Observable<ResponsePayload<Award[]>> {
    return this.http.get<ResponsePayload<Award[]>>(`${this.base}/awards/admin/all`);
  }

  getAwardById(id: string): Observable<ResponsePayload<Award>> {
    return this.http.get<ResponsePayload<Award>>(`${this.base}/awards/${id}`);
  }

  createAward(data: Partial<Award>): Observable<ResponsePayload<Award>> {
    return this.http.post<ResponsePayload<Award>>(`${this.base}/awards`, data);
  }

  updateAward(id: string, data: Partial<Award>): Observable<ResponsePayload<Award>> {
    return this.http.put<ResponsePayload<Award>>(`${this.base}/awards/${id}`, data);
  }

  removeAward(id: string): Observable<ResponsePayload<void>> {
    return this.http.delete<ResponsePayload<void>>(`${this.base}/awards/${id}`);
  }

  // ── References ─────────────────────────────────────────────────────────

  getReferences(): Observable<ResponsePayload<CvReference[]>> {
    return this.http.get<ResponsePayload<CvReference[]>>(`${this.base}/references/admin/all`);
  }

  getReferenceById(id: string): Observable<ResponsePayload<CvReference>> {
    return this.http.get<ResponsePayload<CvReference>>(`${this.base}/references/${id}`);
  }

  createReference(data: Partial<CvReference>): Observable<ResponsePayload<CvReference>> {
    return this.http.post<ResponsePayload<CvReference>>(`${this.base}/references`, data);
  }

  updateReference(
    id: string,
    data: Partial<CvReference>,
  ): Observable<ResponsePayload<CvReference>> {
    return this.http.put<ResponsePayload<CvReference>>(`${this.base}/references/${id}`, data);
  }

  removeReference(id: string): Observable<ResponsePayload<void>> {
    return this.http.delete<ResponsePayload<void>>(`${this.base}/references/${id}`);
  }
}
