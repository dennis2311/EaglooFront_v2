import { toast } from "react-toastify";

export function toastMailSendSuccessMessage(email: string) {
    toast.info(`π§ ${email}@yonsei.ac.kr λ‘ μΈμ¦λ©μΌμ΄ λ°μ‘ λμμ΅λλ€.`, {
        pauseOnHover: false,
    });
}

export function toastSecretVerifySuccessMessage() {
    toast.info(
        `π€© μ΄λ©μΌ μ£Όμ μΈμ¦μ΄ μλ£λμμ΅λλ€. λΉλ°λ²νΈλ₯Ό μ€μ ν΄ μ£ΌμΈμ.`,
        { pauseOnHover: false }
    );
}

export function toastSignupSuccessMessage(email: string) {
    toast.success(
        `π ${email} μ£Όμλ‘ νμκ°μμ΄ μλ£λμμ΅λλ€. κ°μνμ  μ λ³΄λ‘ λ‘κ·ΈμΈ ν΄ μ£ΌμΈμ.`,
        { pauseOnHover: false }
    );
}

export function toastLoginSuccessMessage(email: string) {
    toast(`π μ΄μμ€μΈμ ${email}λ!`, { pauseOnHover: false });
}

export function toastRequestLoginMessage() {
    toast.info(`π§ μλΉμ€ μ΄μ©μ μν΄ λ‘κ·ΈμΈ ν΄ μ£ΌμΈμ.`);
}

export function toastSuccessMessage(message: string) {
    toast.success(`π ${message}`);
}

export function toastInfoMessage(message: string) {
    toast.info(`${message}`);
}

export function toastErrorMessage(message: string) {
    toast.error(`π₯ ${message}`);
}

export function servicePreparingMessage() {
    toast.warn("π₯ μλΉμ€ μ€λΉ μ€μλλ€.");
}
