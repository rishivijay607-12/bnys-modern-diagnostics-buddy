export interface Chapter {
  title: string;
  topics: string[];
}

export const STUDY_TOPICS: Chapter[] = [
  {
    title: "Simple Diagnostics",
    topics: [
      "Introduction to Modern Diagnostics in BNYS",
      "Clinical Hematology & Blood Smears",
      "Urinalysis: Physical, Chemical, Microscopic",
      "Stool Examination for Parasites & Ova",
      "Biochemical Analysis (LFT, KFT)",
    ],
  },
  {
    title: "Complex Diagnostics",
    topics: [
      "Microbiology & Serology Tests",
      "Hormonal Assays (Thyroid, etc.)",
      "Radiology: X-Ray & Ultrasound Principles",
      "Electrocardiography (ECG) Basics",
      "Spirometry & Pulmonary Function Tests",
      "Tumor Markers Overview",
      "Integrating Lab Findings with Naturopathic Diagnosis"
    ],
  },
];
