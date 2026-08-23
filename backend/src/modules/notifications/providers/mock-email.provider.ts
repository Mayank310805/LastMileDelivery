export const mockEmailProvider = async (to: string, subject: string, body: string) => {
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
};
