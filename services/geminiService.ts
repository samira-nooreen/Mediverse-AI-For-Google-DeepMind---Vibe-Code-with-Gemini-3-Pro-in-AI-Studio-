import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to encode file to base64
export const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Clean JSON output in case the model wraps it in markdown blocks
const cleanJson = (text: string) => {
  if (!text) return '{}';
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean;
};

// Permissive safety settings for medical context (Hackathon Demo Mode)
const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
];

const MODEL_FAST = 'gemini-2.5-flash';
// We use Flash for everything now to ensure speed
const MODEL_PRO = 'gemini-2.5-flash'; 

// 1. ER Triage (Fast, Multimodal)
export const analyzeTriage = async (files: File[], symptoms: string) => {
  const fileParts = await Promise.all(files.map(fileToGenerativePart));
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      severity: { type: Type.STRING },
      condition: { type: Type.STRING },
      steps: { type: Type.ARRAY, items: { type: Type.STRING } },
      priority: { type: Type.STRING, enum: ['Red', 'Yellow', 'Green'] },
      visitNeeded: { type: Type.BOOLEAN },
      explanation: { type: Type.STRING },
    },
    required: ['severity', 'condition', 'steps', 'priority', 'visitNeeded', 'explanation'],
  };

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: {
      parts: [
        ...fileParts,
        { text: `You are an expert ER doctor assistant. Analyze these symptoms/images for ER Triage. Symptoms: ${symptoms}. Provide severity, condition, first aid steps, priority (Red/Yellow/Green), and if a visit is needed. Be helpful and calm.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      safetySettings: safetySettings,
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};

// 2. Queue Predictor (Fast, Vision)
export const analyzeQueue = async (file: File) => {
  const filePart = await fileToGenerativePart(file);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      patientCount: { type: Type.INTEGER },
      waitTimeMinutes: { type: Type.INTEGER },
      lowTrafficWindow: { type: Type.STRING },
      crowdStatus: { type: Type.STRING },
    },
    required: ['patientCount', 'waitTimeMinutes', 'lowTrafficWindow', 'crowdStatus'],
  };

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: {
      parts: [
        filePart,
        { text: "Analyze this image of a waiting room. Estimate patient count, wait time in minutes, suggest a low traffic window, and describe crowd status." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      safetySettings: safetySettings,
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};

// 3. Medicine Clash Detector
export const analyzeMedicines = async (files: File[]) => {
  const fileParts = await Promise.all(files.map(fileToGenerativePart));

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      medicines: { type: Type.ARRAY, items: { type: Type.STRING } },
      interactions: { type: Type.ARRAY, items: { type: Type.STRING } },
      schedule: { type: Type.STRING },
      warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['medicines', 'interactions', 'schedule', 'warnings'],
  };

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: {
      parts: [
        ...fileParts,
        { text: "You are a helpful pharmacist. Identify the medicines in this image. 1. List the medicine names. 2. Check for ANY dangerous interactions between them. 3. Suggest a safe daily schedule (e.g. morning/night). 4. List important warnings (drowsiness, etc). If no medicines are clear, say 'Unclear' in the list." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      safetySettings: safetySettings,
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};

// 4. Symptom Diary (Fast, Multimodal)
export const analyzeSymptomDiary = async (files: File[], notes: string, previousContext: string) => {
  const fileParts = await Promise.all(files.map(fileToGenerativePart));

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER, description: "1-10 health score" },
      diagnosis: { type: Type.STRING },
      report: { type: Type.STRING },
    },
    required: ['score', 'diagnosis', 'report'],
  };

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: {
      parts: [
        ...fileParts,
        { text: `Analyze this daily symptom update. Previous Context: ${previousContext}. Today's Notes: ${notes}. Give an improvement score (1-10, 10 is best), probable diagnosis update, and a doctor summary.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      safetySettings: safetySettings,
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};

// 5. Discharge Explainer
export const analyzeDischarge = async (files: File[]) => {
  const fileParts = await Promise.all(files.map(fileToGenerativePart));

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      medicines: { type: Type.ARRAY, items: { type: Type.STRING } },
      reminders: { type: Type.ARRAY, items: { type: Type.STRING } },
      dangerSigns: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['summary', 'medicines', 'reminders', 'dangerSigns'],
  };

  const response = await ai.models.generateContent({
    model: MODEL_FAST, // Using Flash for speed
    contents: {
      parts: [
        ...fileParts,
        { text: "Read this hospital discharge document. Simplify terms for a 5th grader. List meds, create simple reminders, and highlight danger signs clearly." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      safetySettings: safetySettings,
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};

// 6. Surgical Risk
export const analyzeSurgicalRisk = async (files: File[], vitals: string) => {
  const fileParts = await Promise.all(files.map(fileToGenerativePart));

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      riskScore: { type: Type.INTEGER, description: "0-100" },
      analysis: { type: Type.STRING },
      checklist: { type: Type.ARRAY, items: { type: Type.STRING } },
      guidelines: { type: Type.ARRAY, items: { type: Type.STRING } },
      riskFactors: { 
        type: Type.ARRAY, 
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            value: { type: Type.INTEGER, description: "1-10 impact" }
          }
        }
      }
    },
    required: ['riskScore', 'analysis', 'checklist', 'guidelines', 'riskFactors'],
  };

  const response = await ai.models.generateContent({
    model: MODEL_FAST, // Using Flash for speed
    contents: {
      parts: [
        ...fileParts,
        { text: `Analyze these medical reports and vitals for surgical risk. Vitals: ${vitals}. Calculate risk score, provide analysis, 7-day checklist, safety guidelines, and breakdown risk factors. IMPORTANT: Return 'riskFactors.name' with proper spacing (e.g. 'Advanced Age', 'Type 2 Diabetes') and NOT CamelCase.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      safetySettings: safetySettings,
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};

// 7. Indoor Navigation
export const analyzeNavigation = async (file: File, destination: string) => {
  const filePart = await fileToGenerativePart(file);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING },
      route: { type: Type.STRING },
      distanceTime: { type: Type.STRING },
      delays: { type: Type.STRING },
    },
    required: ['location', 'route', 'distanceTime', 'delays'],
  };

  const response = await ai.models.generateContent({
    model: MODEL_FAST,
    contents: {
      parts: [
        filePart,
        { text: `I am at the location shown in the image. I want to go to: ${destination}. Identify where I am, suggest a route, time estimate, and potential crowd delays.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      safetySettings: safetySettings,
    }
  });

  return JSON.parse(cleanJson(response.text || '{}'));
};