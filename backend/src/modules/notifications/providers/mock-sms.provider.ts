export const mockSmsProvider = async (phone: string, message: string) => {
  console.log(`[MOCK SMS] To: ${phone} | Message: ${message}`);
};
