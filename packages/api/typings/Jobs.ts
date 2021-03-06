export default interface DBJob {
  jobId: string;
  companyId: string;
  title: string;
  description: string | null;
  vacancies: number;
  experience: number | null;
  address: string | null;
  district: string | null;
  deadline: Date | null;
}

export interface DBSkill {
  skillName: string;
  jobId: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
}
export interface Skill {
  skillName: string;
  proficiency: string;
}

export interface Qualifications {
  qid: string;
  level: string;
  degree: string;
  discipline: string;
}

export interface Job extends DBJob {
  qualifications: string[];
  skills: Skill[];
}

export interface JobReturn extends DBJob {
  qualifications: Qualifications[];
  skills: Skill[];
}

export interface JobSkill {
  skillName: string;
  proficiency: string;
}

export interface JobQualification {
  level: string;
  discipline: string;
  degree: string;
}

export type JobInput = Omit<Job, 'jobId'>;
