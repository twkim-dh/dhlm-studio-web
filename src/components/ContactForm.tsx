"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <div className="text-4xl mb-4">&#x2705;</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          메시지가 전송되었습니다
        </h3>
        <p className="text-gray-600">빠른 시일 내에 답변 드리겠습니다.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", message: "" });
          }}
          className="mt-6 text-sm font-medium underline"
          style={{ color: "var(--brand-green)" }}
        >
          새 메시지 작성
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl bg-gray-50 border border-gray-100 p-6 sm:p-8"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          이름
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="홍길동"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 transition-shadow"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          이메일
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 transition-shadow"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          메시지
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="문의 내용을 입력해주세요"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 transition-shadow resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: "var(--brand-green)" }}
      >
        메시지 보내기
      </button>
    </form>
  );
}
