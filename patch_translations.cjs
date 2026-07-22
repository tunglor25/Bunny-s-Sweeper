const fs = require('fs');

const file = 'src/translations.ts';
let content = fs.readFileSync(file, 'utf8');

const subtitles = {
  en: { practiceSub: 'Learn the basics', normalSub: 'Classic challenge', hardSub: 'For expert players' },
  vi: { practiceSub: 'Học cách chơi', normalSub: 'Thử thách cơ bản', hardSub: 'Dành cho cao thủ' },
  es: { practiceSub: 'Aprende lo básico', normalSub: 'Desafío clásico', hardSub: 'Para expertos' },
  fr: { practiceSub: 'Apprenez les bases', normalSub: 'Défi classique', hardSub: 'Pour les experts' },
  de: { practiceSub: 'Grundlagen lernen', normalSub: 'Klassische Herausforderung', hardSub: 'Für Profis' },
  it: { practiceSub: 'Impara le basi', normalSub: 'Sfida classica', hardSub: 'Per esperti' },
  pt: { practiceSub: 'Aprenda o básico', normalSub: 'Desafio clássico', hardSub: 'Para especialistas' },
  ru: { practiceSub: 'Изучите основы', normalSub: 'Классика', hardSub: 'Для экспертов' },
  zh: { practiceSub: '学习基础', normalSub: '经典挑战', hardSub: '高手进阶' },
  ja: { practiceSub: '基本を学ぶ', normalSub: 'クラシックな挑戦', hardSub: '上級者向け' },
  ko: { practiceSub: '기본 배우기', normalSub: '클래식 도전', hardSub: '전문가용' },
  ar: { practiceSub: 'تعلم الأساسيات', normalSub: 'تحدي كلاسيكي', hardSub: 'للخبراء' },
  hi: { practiceSub: 'मूल बातें सीखें', normalSub: 'क्लासिक चुनौती', hardSub: 'विशेषज्ञों के लिए' },
  id: { practiceSub: 'Pelajari dasarnya', normalSub: 'Tantangan klasik', hardSub: 'Untuk ahli' },
  th: { practiceSub: 'เรียนรู้พื้นฐาน', normalSub: 'ความท้าทายคลาสสิก', hardSub: 'สำหรับผู้เชี่ยวชาญ' },
  tr: { practiceSub: 'Temelleri öğren', normalSub: 'Klasik meydan okuma', hardSub: 'Uzmanlar için' },
  pl: { practiceSub: 'Poznaj podstawy', normalSub: 'Klasyczne wyzwanie', hardSub: 'Dla ekspertów' }
};

for (const lang in subtitles) {
  const practiceSub = subtitles[lang].practiceSub;
  const normalSub = subtitles[lang].normalSub;
  const hardSub = subtitles[lang].hardSub;
  
  content = content.replace(
    new RegExp(`(${lang}:\\s*{[\\s\\S]*?)(practice: .+,)`),
    `$1practiceSub: '${practiceSub}',\n    normalSub: '${normalSub}',\n    hardSub: '${hardSub}',\n    $2`
  );
}

fs.writeFileSync(file, content);
console.log('Translations patched successfully!');
