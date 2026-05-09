import { Component } from '@angular/core';

import { CvService } from '../../../services/common/cv.service';
import { UiService } from '../../../services/common/ui.service';

type SourceType = 'text' | 'pdf' | 'docx' | 'image';

@Component({
  selector: 'app-import-cv',
  templateUrl: './import-cv.component.html',
  styleUrls: ['./import-cv.component.scss'],
})
export class ImportCvComponent {
  sourceType: SourceType = 'text';
  parserEngine: 'basic' | 'ollama' = 'ollama';
  applyMode: 'replace' | 'merge' = 'merge';
  pastedText = '';
  selectedFile: File | null = null;
  extractedText = '';
  parsing = false;
  applying = false;
  parsedResult: unknown = null;

  constructor(
    private readonly cv: CvService,
    private readonly ui: UiService,
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.parsedResult = null;
  }

  async parse(): Promise<void> {
    this.parsing = true;
    this.parsedResult = null;
    try {
      const text = this.pastedText.trim() || (this.selectedFile ? await this.extractTextFromFile(this.selectedFile) : '');
      if (!text || text.trim().length < 20) {
        this.ui.error('Please provide a longer CV text or a readable file.');
        this.parsing = false;
        return;
      }
      this.extractedText = text;
      this.cv.parseResume(text, this.sourceType, this.parserEngine).subscribe({
        next: (res) => {
          this.parsedResult = res.data ?? null;
          this.parsing = false;
          this.ui.success((res.message as string) || 'Resume parsed successfully.');
        },
        error: () => {
          this.parsing = false;
          this.ui.error('Failed to parse resume.');
        },
      });
    } catch (err) {
      this.parsing = false;
      this.ui.error((err as Error)?.message ?? 'Failed to extract text from file.');
    }
  }

  apply(): void {
    if (!this.extractedText) {
      this.ui.error('Parse a resume first.');
      return;
    }
    this.applying = true;
    this.cv.applyResume(this.extractedText, this.applyMode, this.parserEngine).subscribe({
      next: () => {
        this.ui.success(`Resume data imported (${this.applyMode} mode).`);
        this.applying = false;
      },
      error: () => {
        this.ui.error('Failed to apply imported CV data.');
        this.applying = false;
      },
    });
  }

  private async extractTextFromFile(file: File): Promise<string> {
    const name = file.name.toLowerCase();
    if (name.endsWith('.txt')) {
      this.sourceType = 'text';
      return file.text();
    }
    if (name.endsWith('.pdf')) {
      this.sourceType = 'pdf';
      return this.extractPdfText(file);
    }
    if (name.endsWith('.docx')) {
      this.sourceType = 'docx';
      return this.extractDocxText(file);
    }
    if (file.type.startsWith('image/')) {
      this.sourceType = 'image';
      return this.extractImageText(file);
    }
    throw new Error('Unsupported file type. Use TXT, PDF, DOCX, or image.');
  }

  private async extractPdfText(file: File): Promise<string> {
    await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    const pdfjsLib = (window as unknown as { pdfjsLib?: any }).pdfjsLib;
    if (!pdfjsLib) throw new Error('PDF parser failed to load.');
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += `${content.items.map((it: any) => it.str).join(' ')}\n`;
    }
    return text;
  }

  private async extractDocxText(file: File): Promise<string> {
    await this.loadScript('https://unpkg.com/mammoth@1.7.2/mammoth.browser.min.js');
    const mammoth = (window as unknown as { mammoth?: any }).mammoth;
    if (!mammoth) throw new Error('DOCX parser failed to load.');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  }

  private async extractImageText(file: File): Promise<string> {
    await this.loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
    const tesseract = (window as unknown as { Tesseract?: any }).Tesseract;
    if (!tesseract) throw new Error('OCR engine failed to load.');
    const result = await tesseract.recognize(file, 'eng');
    return result.data?.text || '';
  }

  private loadScript(src: string): Promise<void> {
    const existing = document.querySelector(`script[data-src="${src}"]`) as HTMLScriptElement | null;
    if (existing) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset['src'] = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  }
}
