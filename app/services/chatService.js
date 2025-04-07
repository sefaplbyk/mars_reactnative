import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "react-native-dotenv";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateResponse = async (scientist, message) => {
  try {
    console.log("chatbot req");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `Sen ${scientist.name}'sın. Kendi döneminin bilgilerini, konuşma tarzını ve kişiliğini yansıtarak, samimi ve eğitici bir şekilde şu soruya cevap ver.
     Cevapların kısa ve anlaşılır olsun: ${message}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Hatası:", error);
    return "Bir hata oluştu, lütfen tekrar deneyin.";
  }
};
