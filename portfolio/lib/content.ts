import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/i18n/routing';

const contentDir = path.join(process.cwd(), 'content');

function readContent(locale: Locale, filename: string) {
  const filePath = path.join(contentDir, locale, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return matter(raw);
}

// ─── Profile ────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  bio: string;
}

export function getProfile(locale: Locale): Profile {
  const { data, content } = readContent(locale, 'profile.md');
  return {
    name: data.name ?? '',
    title: data.title ?? '',
    tagline: data.tagline ?? '',
    email: data.email ?? '',
    github: data.github ?? '',
    linkedin: data.linkedin ?? '',
    location: data.location ?? '',
    bio: content.trim(),
  };
}

// ─── Experience ─────────────────────────────────────────────────────────────

export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

export function getExperience(locale: Locale): ExperienceEntry[] {
  const { data } = readContent(locale, 'experience.md');
  return (data.entries ?? []) as ExperienceEntry[];
}

// ─── Skills ─────────────────────────────────────────────────────────────────

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
  certifications: { name: string; issuer: string }[];
  soft_skills: string[];
}

export function getSkills(locale: Locale): SkillsData {
  const { data } = readContent(locale, 'skills.md');
  return {
    categories: data.categories ?? [],
    certifications: data.certifications ?? [],
    soft_skills: data.soft_skills ?? [],
  };
}

// ─── Education ──────────────────────────────────────────────────────────────

export interface EducationEntry {
  school: string;
  degree: string;
  department: string;
  period: string;
  activities: string[];
  achievements: string[];
}

export function getEducation(locale: Locale): EducationEntry[] {
  const { data } = readContent(locale, 'education.md');
  return (data.entries ?? []) as EducationEntry[];
}

// ─── Projects ───────────────────────────────────────────────────────────────

export interface ProjectEntry {
  name: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
}

export function getProjects(locale: Locale): ProjectEntry[] {
  const { data } = readContent(locale, 'projects.md');
  return (data.entries ?? []) as ProjectEntry[];
}

// ─── AI Cases ────────────────────────────────────────────────────────────────

export type AiCaseCategory = 'prompt' | 'agent' | 'tooling';

export interface AiCaseEntry {
  id: string;
  category: AiCaseCategory;
  title: string;
  description: string;
  tools: string[];
  outcome?: string;
  github?: string;
}

export function getAiCases(locale: Locale): AiCaseEntry[] {
  const { data } = readContent(locale, 'ai-cases.md');
  return (data.entries ?? []) as AiCaseEntry[];
}
