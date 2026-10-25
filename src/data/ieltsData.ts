/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromptTopic {
  id: string;
  taskType: 'task1' | 'task2';
  title: string;
  category: string;
  subType: string; // 'Line Graph', 'Bar Chart', 'Map', 'Process', 'Opinion', 'Discussion', etc.
  prompt: string;
  minWords: number;
  timeLimitMinutes: number;
  chartDetails?: {
    type: 'line' | 'bar' | 'pie' | 'process' | 'map';
    title: string;
    labels: string[];
    datasets: {
      name: string;
      color: string;
      values: number[];
    }[];
    notes: string;
  };
  sampleOutline: {
    section: string;
    content: string;
  }[];
  modelAnswer: {
    band: number;
    text: string;
    keyHighlights: {
      type: 'overview' | 'argument' | 'collocation' | 'cohesion' | 'grammar';
      label: string;
      textSnippet: string;
      explanationVi: string;
    }[];
  };
}

export const SAMPLE_PROMPTS: PromptTopic[] = [
  {
    id: 't2-edu-tech',
    taskType: 'task2',
    title: 'Trí tuệ nhân tạo & Công nghệ trong Giáo dục',
    category: 'Giáo dục & Công nghệ',
    subType: 'Opinion (Agree or Disagree)',
    prompt:
      'Some people believe that artificial intelligence and online tools will completely replace human teachers in the future. To what extent do you agree or disagree?',
    minWords: 250,
    timeLimitMinutes: 40,
    sampleOutline: [
      {
        section: 'Introduction (Mở bài - 2 câu)',
        content: 'Paraphrase đề bài về xu hướng AI trong giáo dục + Nêu rõ lập trường phản đối (Strongly disagree): AI là công cụ hỗ trợ đắc lực nhưng không thể thay thế hoàn toàn vai trò của người thầy.',
      },
      {
        section: 'Body 1 (Thân bài 1 - Điểm mạnh của AI)',
        content: 'Thừa nhận AI tối ưu hóa lộ trình học tập cá nhân hóa (adaptive learning algorithms) và chấm điểm tự động tức thì.',
      },
      {
        section: 'Body 2 (Thân bài 2 - Lý do con người là không thể thay thế)',
        content: 'Người thầy mang lại trí tuệ cảm xúc (emotional intelligence), truyền cảm hứng đạo đức, tư duy phản biện và đồng cảm tinh thần - điều mà thuật toán vô tri không bao giờ sao chép được.',
      },
      {
        section: 'Conclusion (Kết bài - 1 câu)',
        content: 'Khẳng định lại: Mô hình kết hợp (blended model) nơi AI là trợ thủ cho giáo viên là tương lai bền vững nhất.',
      },
    ],
    modelAnswer: {
      band: 9.0,
      text:
        `In recent years, the rapid advancement of artificial intelligence has precipitated vigorous debate regarding the future of traditional pedagogical practices. While some commentators argue that automated systems will render human educators obsolete, I fundamentally disagree with this proposition. Although digital algorithms undoubtedly optimize logistical instruction, the indispensable qualities of emotional intelligence, moral mentorship, and dynamic human empathy remain fundamentally irreproducible by machines.\n\nOn the one hand, proponents of AI-driven classrooms reasonably cite unparalleled efficiency and customized pacing. Machine learning algorithms can meticulously analyze student performance data in real time, pinpointing conceptual weaknesses with mathematical precision and delivering personalized remedial exercises. Furthermore, intelligent tutoring programs offer round-the-clock availability, liberating instructors from laborious grading tasks and providing equitable access to high-caliber academic materials across geographical borders. In this capacity, technological platforms undeniably serve as invaluable instructional supplements.\n\nNevertheless, teaching transcends the mere mechanical dissemination of facts. The cornerstone of genuine pedagogy lies in interpersonal connection, inspiration, and psychological discernment. An experienced teacher perceives nuanced behavioral cues—such as frustration, apathy, or anxiety—and adapts their demeanor to restore confidence and cultivate intellectual curiosity. Moreover, nurturing critical thinking, ethical discernment, and collaborative teamwork necessitates spontaneous classroom discourse guided by human wisdom rather than pre-programmed responses. A machine may impart knowledge, but only an authentic human mentor can instill character, resilience, and lifelong academic passion.\n\nIn conclusion, while artificial intelligence will irrevocably transform the educational landscape into a more streamlined paradigm, it must be recognized as a complementary asset rather than an outright replacement. The human educator remains the irreplaceable soul of the classroom.`,
      keyHighlights: [
        {
          type: 'argument',
          label: 'Thesis Statement dứt khoát',
          textSnippet: 'I fundamentally disagree with this proposition.',
          explanationVi: 'Câu mở bài thể hiện lập trường rõ ràng, không mập mờ, ghi điểm tối đa Task Response.',
        },
        {
          type: 'collocation',
          label: 'Cụm từ học thuật C2',
          textSnippet: 'precipitated vigorous debate',
          explanationVi: 'Thay vì dùng "caused big arguments", cụm từ này nâng tầm học thuật vượt bậc.',
        },
        {
          type: 'collocation',
          label: 'Thuật ngữ chuyên ngành giáo dục',
          textSnippet: 'pedagogical practices / moral mentorship / intellectual curiosity',
          explanationVi: 'Bộ từ vựng trường nghĩa chuyên sâu về giáo dục giúp tiêu chí Lexical Resource đạt Band 9.0.',
        },
        {
          type: 'grammar',
          label: 'Cấu trúc tương phản đối lập',
          textSnippet: 'A machine may impart knowledge, but only an authentic human mentor can instill character...',
          explanationVi: 'Sử dụng cấu trúc câu kép tương phản đối xứng sắc bén tạo sức thuyết phục vượt trội.',
        },
      ],
    },
  },
  {
    id: 't1-renewable-energy',
    taskType: 'task1',
    title: 'Biểu đồ đường: Xu hướng năng lượng tái tạo (2010 - 2025)',
    category: 'Môi trường & Năng lượng',
    subType: 'Line Graph',
    prompt:
      'The line graph below shows the percentage of total electricity produced from three different renewable energy sources in a European country from 2010 to 2025.',
    minWords: 150,
    timeLimitMinutes: 20,
    chartDetails: {
      type: 'line',
      title: 'Tỷ lệ % điện lượng sản xuất từ năng lượng tái tạo (2010 - 2025)',
      labels: ['2010', '2013', '2016', '2019', '2022', '2025'],
      datasets: [
        { name: 'Năng lượng Gió (Wind)', color: '#0284c7', values: [12, 16, 22, 29, 36, 42] },
        { name: 'Năng lượng Mặt trời (Solar)', color: '#eab308', values: [4, 8, 15, 23, 31, 38] },
        { name: 'Thủy điện (Hydroelectric)', color: '#059669', values: [28, 27, 26, 25, 24, 23] },
      ],
      notes: 'Đơn vị tính: Phần trăm (%). Gió và Mặt trời tăng trưởng vượt bậc, trong khi Thủy điện duy trì xu hướng giảm nhẹ ổn định.',
    },
    sampleOutline: [
      {
        section: '1. Introduction',
        content: 'Paraphrase lại đề bài: The line graph delineates the proportion of electricity generated from wind, solar, and hydroelectric power in a specific European nation between 2010 and 2025.',
      },
      {
        section: '2. Overview (Bắt buộc)',
        content: 'Chỉ ra 2 đặc điểm bao quát: (1) Gió và Mặt trời trải qua xu thế tăng trưởng vũ bão; (2) Thủy điện từ vị trí số 1 năm 2010 tụt xuống vị trí thấp nhất vào năm 2025.',
      },
      {
        section: '3. Detail Paragraph 1 (Wind & Solar)',
        content: 'Mô tả chi tiết số liệu của Gió (từ 12% lên mức đỉnh 42%) và Mặt trời (bứt phá từ 4% lên 38%).',
      },
      {
        section: '4. Detail Paragraph 2 (Hydroelectric)',
        content: 'Mô tả sự thoái trào nhẹ của Thủy điện từ mức 28% xuống 23%, bị hai nguồn năng lượng kia vượt mặt vào khoảng năm 2017 - 2019.',
      },
    ],
    modelAnswer: {
      band: 9.0,
      text:
        `The line graph delineates the proportion of electricity generated from three distinct renewable sources—wind, solar, and hydroelectric power—in a European nation over a 15-year period from 2010 to 2025.\n\nOverall, it is manifestly evident that electricity production from wind and solar experienced dramatic upward trajectories, whereas hydroelectric generation exhibited a slight, steady decline. Furthermore, while hydroelectricity commenced as the dominant renewable source in 2010, it was subsequently eclipsed by both wind and solar power by the end of the timeline.\n\nLooking first at the expanding sources, wind energy initiated the period at 12% before surging progressively to reach 22% in 2016. Thereafter, this upward momentum accelerated, culminating in a peak of 42% in 2025, solidifying its rank as the principal contributor. Solar power exhibited an even more striking trajectory; having constituted a mere 4% of production in 2010, it expanded nearly tenfold over the survey window, overtaking hydroelectricity around 2020 and finishing closely behind wind at 38%.\n\nIn stark contrast, hydroelectric energy represented 28% of total renewable electricity in 2010, establishing a substantial lead over the other two categories. However, its share contracted gradually yet continuously over the ensuing decade and a half, dipping to 25% in 2019 before stabilizing at 23% in 2025, ultimately becoming the least prevalent energy modality.`,
      keyHighlights: [
        {
          type: 'overview',
          label: 'Overview mẫu mực Band 9',
          textSnippet: 'Overall, it is manifestly evident that electricity production from wind and solar experienced dramatic upward trajectories...',
          explanationVi: 'Overview nêu đủ 2 xu hướng lớn nhất (tổng quát và so sánh tương quan) mà không chứa số liệu cụ thể thừa thãi.',
        },
        {
          type: 'collocation',
          label: 'Động từ miêu tả xu hướng Task 1',
          textSnippet: 'surging progressively / accelerated / culminating in a peak of / eclipsed by',
          explanationVi: 'Các cụm động từ chỉ xu thế thay đổi đa dạng, không bị lặp lại từ "increase" hay "decrease".',
        },
      ],
    },
  },
  {
    id: 't2-env-responsibility',
    taskType: 'task2',
    title: 'Trách nhiệm Bảo vệ Môi trường: Cá nhân hay Chính phủ & Tập đoàn?',
    category: 'Môi trường & Xã hội',
    subType: 'Discussion (Discuss both views & give opinion)',
    prompt:
      'Some people believe that environmental protection is the sole responsibility of politicians and major corporations, while others argue that individuals must also take active responsibility. Discuss both views and give your own opinion.',
    minWords: 250,
    timeLimitMinutes: 40,
    sampleOutline: [
      {
        section: 'Introduction',
        content: 'Giới thiệu cuộc tranh luận về trách nhiệm bảo vệ môi trường + Khẳng định quan điểm cá nhân: Cần sự phối hợp tổng lực giữa chính sách vĩ mô và thói quen tiêu dùng vi mô của từng công dân.',
      },
      {
        section: 'Body 1: Vai trò của Chính phủ và Tập đoàn',
        content: 'Chính phủ có quyền lực lập pháp (luật bảo vệ môi trường, thuế carbon) và doanh nghiệp là nguồn xả thải công nghiệp quy mô lớn.',
      },
      {
        section: 'Body 2: Vai trò của Cá nhân',
        content: 'Quyền lực của người tiêu dùng (consumer power) định hình thị trường; lối sống xanh (zero-waste, tiết kiệm năng lượng) tạo sức ép lên doanh nghiệp.',
      },
      {
        section: 'Conclusion',
        content: 'Tóm lược: Một bàn tay không thể vỗ nên tiếng - bảo vệ môi trường là trách nhiệm hiệp đồng (shared responsibility).',
      },
    ],
    modelAnswer: {
      band: 8.5,
      text:
        `The question of who shoulders the primary burden of environmental preservation remains a contentious global issue. While one school of thought contends that environmental remediation rests exclusively in the hands of governments and multinational enterprises, another faction asserts that private citizens must also take decisive action. In my perspective, meaningful ecological sustainability can only be attained through a concerted partnership between state-level policy enforcement and individual civic duty.\n\nOn the one hand, substantial justification exists for demanding that corporate entities and governmental authorities spearhead conservation efforts. Nation-states possess the legislative authority to implement legally binding carbon emissions quotas, penalize polluters, and subsidize green infrastructure projects such as renewable energy grids and waste management systems. Furthermore, transnational corporations account for the overwhelming preponderance of greenhouse gas emissions and resource depletion. Consequently, holding industrial giants accountable through stringent regulatory frameworks and mandates for circular economy practices represents the most direct mechanism for curbing environmental destruction at scale.\n\nOn the other hand, the vital agency of individuals cannot be dismissed as negligible. Collective consumer choices exert immense leverage over corporate behavior; when millions of citizens consciously boycott ecologically detrimental products in favor of sustainable alternatives, businesses are economically compelled to decarbonize their supply chains. Moreover, grassroots lifestyle modifications—ranging from curtailing single-use plastics and minimizing domestic energy waste to utilizing public transit—cumulatively yield profound reductions in the global ecological footprint. Without widespread public compliance and environmental stewardship, even the most ambitious state legislation risks becoming ineffective.\n\nIn conclusion, rather than viewing environmental responsibility through a mutually exclusive dichotomy, it should be conceived as a symbiotic synergy. Governments must establish the structural parameters, while individuals must demonstrate the civic commitment necessary to translate policy into everyday ecological resilience.`,
      keyHighlights: [
        {
          type: 'argument',
          label: 'Góc nhìn kết hợp hài hòa (Balanced view)',
          textSnippet: 'meaningful ecological sustainability can only be attained through a concerted partnership...',
          explanationVi: 'Thể hiện tư duy phản biện cao cấp khi chỉ ra cả 2 bên cùng phụ thuộc lẫn nhau.',
        },
        {
          type: 'collocation',
          label: 'Collocation học thuật đắt giá',
          textSnippet: 'spearhead conservation efforts / preponderance of greenhouse gas emissions / symbiotic synergy',
          explanationVi: 'Các cụm từ vựng band 8.5+ gây ấn tượng mạnh với giám khảo.',
        },
      ],
    },
  },
  {
    id: 't1-process-recycling',
    taskType: 'task1',
    title: 'Quy trình sản xuất: Tái chế chai nhựa PET',
    category: 'Sản xuất & Môi trường',
    subType: 'Process Diagram',
    prompt:
      'The diagram illustrates the sequential stages involved in the recycling process of plastic bottles to produce reusable fabric.',
    minWords: 150,
    timeLimitMinutes: 20,
    sampleOutline: [
      {
        section: 'Introduction',
        content: 'Paraphrase: The flow chart details the linear industrial process through which discarded plastic bottles are converted into recycled yarn and fabric.',
      },
      {
        section: 'Overview',
        content: 'Quy trình gồm khoảng 8 bước khép kín, khởi đầu từ việc thu gom phân loại rác thải và kết thúc bằng việc dệt thành sợi vải thương phẩm.',
      },
      {
        section: 'Detail 1 (Giai đoạn tiền xử lý)',
        content: 'Thu gom, vận chuyển, làm sạch nhãn mác, nghiền thành mảnh nhựa nhỏ (plastic flakes).',
      },
      {
        section: 'Detail 2 (Giai đoạn nhiệt luyện & dệt)',
        content: 'Đun nóng chảy, kéo thành sợi polyester và dệt thành cuộn vải hoàn chỉnh.',
      },
    ],
    modelAnswer: {
      band: 8.5,
      text:
        `The provided flow diagram delineates the sequential industrial stages by which post-consumer plastic containers are recycled into synthetic textiles.\n\nOverall, the recycling cycle constitutes an eight-stage linear procedure, divided fundamentally into two phases: the mechanical collection and purification of plastic waste, followed by thermal extrusion and textile manufacturing.\n\nIn the primary phase, discarded plastic bottles are accumulated at designated collection hubs before being transported by freight trucks to processing facilities. Upon arrival, the bottles undergo rigorous sorting to eliminate non-PET contaminants and are subsequently compacted into dense, rectangular bales. These compressed units are then fed into industrial shredders where they are fragmented into minute plastic flakes, which are thoroughly washed and cleansed in chemical disinfectant baths to strip away adhesives and dirt residues.\n\nDuring the subsequent thermal stage, the cleaned flakes are placed into specialized furnaces and melted into a uniform liquid state. This molten plastic is then forced through fine spinnarets to form continuous synthetic filaments. Once cooled, these threads are wound onto mechanical spools and woven into robust rolls of fabric, primed for clothing production.`,
      keyHighlights: [
        {
          type: 'grammar',
          label: 'Ngữ pháp thể bị động (Passive voice in Process)',
          textSnippet: 'are accumulated / are subsequently compacted / are fragmented / is forced through',
          explanationVi: 'Đặc trưng của bài Process Task 1 là sử dụng nhuần nhuyễn thể bị động khách quan.',
        },
      ],
    },
  },
];

export interface BandDescriptorCriteria {
  criterion: 'TA' | 'CC' | 'LR' | 'GRA';
  titleVi: string;
  titleEn: string;
  weight: string;
  summaryVi: string;
  bandLevels: {
    band: number;
    descriptionVi: string;
    keyChecklist: string[];
    commonMistakes: string[];
  }[];
}

export const OFFICIAL_BAND_DESCRIPTORS: BandDescriptorCriteria[] = [
  {
    criterion: 'TA',
    titleVi: 'Hoàn thành nhiệm vụ / Trả lời đúng trọng tâm',
    titleEn: 'Task Achievement (Task 1) & Task Response (Task 2)',
    weight: '25% tổng điểm',
    summaryVi:
      'Đánh giá mức độ bạn trả lời đầy đủ mọi phần của đề bài, nêu quan điểm xuyên suốt và phát triển luận điểm có dẫn chứng logic sâu sắc.',
    bandLevels: [
      {
        band: 9.0,
        descriptionVi: 'Hoàn toàn đáp ứng tất cả yêu cầu đề bài; phát triển ý tưởng sâu sắc, lập trường nhất quán và sáng tỏ.',
        keyChecklist: ['Trả lời trọn vẹn 100% câu hỏi', 'Overview nổi bật (Task 1)', 'Dẫn chứng sắc bén, không có chi tiết thừa'],
        commonMistakes: ['Không mắc lỗi lạc đề hay diễn đạt quá chung chung'],
      },
      {
        band: 7.0,
        descriptionVi: 'Đáp ứng tốt các yêu cầu đề bài; nêu rõ quan điểm xuyên suốt; có luận điểm và ví dụ minh họa rõ ràng.',
        keyChecklist: ['Lập trường rõ ràng từ đầu đến cuối', 'Có câu chủ đề cho mỗi đoạn', 'Số từ vượt mốc 250 (Task 2) hoặc 150 (Task 1)'],
        commonMistakes: ['Một số luận điểm giải thích chưa thực sự đào sâu, còn hơi vội vàng'],
      },
      {
        band: 5.0,
        descriptionVi: 'Chỉ trả lời được một phần đề bài hoặc lạc đề cục bộ; ý tưởng còn sơ sài, thiếu dẫn chứng cụ thể.',
        keyChecklist: ['Bài viết thiếu câu trả lời trực diện', 'Không có câu Overview trong Task 1'],
        commonMistakes: ['Dưới số từ tối thiểu', 'Nêu ý tưởng nhưng không giải thích vì sao'],
      },
    ],
  },
  {
    criterion: 'CC',
    titleVi: 'Độ mạch lạc và Liên kết câu',
    titleEn: 'Coherence & Cohesion',
    weight: '25% tổng điểm',
    summaryVi:
      'Đánh giá cách tổ chức ý tưởng thành các đoạn văn khoa học và sử dụng các phương tiện liên kết (từ nối, phép thế, đại từ) mượt mà tự nhiên.',
    bandLevels: [
      {
        band: 9.0,
        descriptionVi: 'Liên kết ý tưởng tự nhiên đến mức người đọc không cảm thấy sự gượng ép của từ nối. Phân đoạn hoàn hảo.',
        keyChecklist: ['Mỗi đoạn 1 ý tưởng trung tâm', 'Dùng phép thế và đại từ uyển chuyển', 'Không lạm dụng liên từ đầu câu'],
        commonMistakes: ['Tuyệt đối không dùng rập khuôn "First and foremost", "Secondly" một cách máy móc'],
      },
      {
        band: 7.0,
        descriptionVi: 'Tổ chức thông tin logic; sử dụng linh hoạt các liên từ dù đôi chỗ có thể hơi cứng nhắc hoặc lặp lại.',
        keyChecklist: ['Chia 4 đoạn cân đối (Intro, Body 1, Body 2, Concl)', 'Liên từ chuyển đoạn tự nhiên'],
        commonMistakes: ['Dùng sai dấu câu khi nối câu bằng "However", "Therefore"'],
      },
      {
        band: 5.0,
        descriptionVi: 'Thiếu tổ chức đoạn văn hợp lý; lạm dụng hoặc dùng sai nghĩa của các từ nối.',
        keyChecklist: ['Viết một đoạn văn quá dài hoặc mỗi câu là một đoạn riêng biệt'],
        commonMistakes: ['Nhồi nhét liên từ ở mọi câu: "Furthermore, Moreover, Besides, In addition..."'],
      },
    ],
  },
  {
    criterion: 'LR',
    titleVi: 'Vốn từ vựng và Cụm từ học thuật',
    titleEn: 'Lexical Resource',
    weight: '25% tổng điểm',
    summaryVi:
      'Đánh giá độ phong phú của từ vựng, khả năng dùng collocations tự nhiên, phong cách học thuật và độ chuẩn xác về chính tả.',
    bandLevels: [
      {
        band: 9.0,
        descriptionVi: 'Sử dụng từ vựng tinh tế, hiếm gặp với độ tự nhiên như người bản xứ; kiểm soát tuyệt đối ngữ cảnh.',
        keyChecklist: ['Collocations C1/C2 tự nhiên', 'Paraphrase linh hoạt không lặp từ', 'Chính tả và dạng từ chuẩn 100%'],
        commonMistakes: ['Không ép từ đao to búa lớn vào sai ngữ cảnh'],
      },
      {
        band: 7.0,
        descriptionVi: 'Có vốn từ vựng học thuật phong phú; biết dùng collocations ít thông dụng; đôi chỗ mắc lỗi nhỏ về chọn từ.',
        keyChecklist: ['Tránh các từ thông tục (kids, big, stuff, things)', 'Dùng đúng các thuật ngữ của chủ đề'],
        commonMistakes: ['Dịch trực tiếp từng từ từ tiếng Việt (Vietlish)'],
      },
      {
        band: 5.0,
        descriptionVi: 'Vốn từ bị giới hạn, lặp lại từ của đề bài nhiều lần; mắc lỗi chính tả gây khó khăn cho người đọc.',
        keyChecklist: ['Hay lặp các từ đơn giản như "good", "bad", "problem", "solve"'],
        commonMistakes: ['Lỗi chính tả nghiêm trọng (sai đuôi -tion, -ment, số ít/số nhiều)'],
      },
    ],
  },
  {
    criterion: 'GRA',
    titleVi: 'Độ đa dạng và Chuẩn xác ngữ pháp',
    titleEn: 'Grammatical Range & Accuracy',
    weight: '25% tổng điểm',
    summaryVi:
      'Đánh giá sự đa dạng của các cấu trúc câu (câu ghép, câu phức, đảo ngữ, rút gọn) và tỷ lệ câu hoàn toàn không có lỗi sai.',
    bandLevels: [
      {
        band: 9.0,
        descriptionVi: 'Sử dụng một phạm vi rộng lớn các cấu trúc câu phức tạp với sự linh hoạt và độ chính xác hoàn hảo.',
        keyChecklist: ['Mệnh đề phân từ (Participle clauses)', 'Câu đảo ngữ (Inversion)', 'Đa dạng thể bị động khách quan'],
        commonMistakes: ['Hầu như không có lỗi ngữ pháp hoặc dấu phẩy'],
      },
      {
        band: 7.0,
        descriptionVi: 'Sử dụng thường xuyên các câu phức; phần lớn các câu không mắc lỗi; kiểm soát tốt thì và sự hòa hợp chủ - vị.',
        keyChecklist: ['Kết hợp câu điều kiện, mệnh đề quan hệ', 'Độ chuẩn xác ngữ pháp đạt trên 70%'],
        commonMistakes: ['Lỗi dấu câu (comma splice) hoặc quên chia động từ số ít'],
      },
      {
        band: 5.0,
        descriptionVi: 'Chỉ dùng được các cấu trúc câu đơn giản; thường xuyên mắc lỗi ngữ pháp khiến thông điệp bị gián đoạn.',
        keyChecklist: ['Chỉ viết câu đơn: S + V + O', 'Hay nhầm lẫn giữa tính từ và trạng từ'],
        commonMistakes: ['Lỗi chia động từ, thiếu mạo từ (a, an, the)'],
      },
    ],
  },
];

export interface CollocationItem {
  id: string;
  topic: string;
  simpleWord: string;
  band6Example: string;
  advancedCollocation: string;
  band8Example: string;
  explanationVi: string;
}

export const ACADEMIC_COLLOCATIONS: CollocationItem[] = [
  {
    id: 'c1',
    topic: 'Nguyên nhân & Hậu quả',
    simpleWord: 'cause a big problem',
    band6Example: 'Pollution causes big problems for people in cities.',
    advancedCollocation: 'pose severe ramifications for / precipitate catastrophic consequences',
    band8Example: 'Rampant industrial emissions pose severe ramifications for the respiratory health of urban denizens.',
    explanationVi: '"Pose severe ramifications" thể hiện hậu quả sâu rộng và nghiêm trọng theo phong cách học thuật trang trọng.',
  },
  {
    id: 'c2',
    topic: 'Tầm quan trọng',
    simpleWord: 'very important / play a big role',
    band6Example: 'Education is very important for children.',
    advancedCollocation: 'be of paramount importance / play a pivotal role in',
    band8Example: 'Quality early-childhood education is of paramount importance in fostering cognitive resilience.',
    explanationVi: 'Thay vì dùng "very + adj", người bản ngữ học thuật thường dùng cấu trúc "be of + abstract noun" (be of paramount importance).',
  },
  {
    id: 'c3',
    topic: 'Giải quyết vấn đề',
    simpleWord: 'solve the problem / fix this thing',
    band6Example: 'The government should solve the housing problem.',
    advancedCollocation: 'implement robust measures to mitigate this predicament',
    band8Example: 'Municipal authorities must implement robust fiscal measures to mitigate the acute affordable housing predicament.',
    explanationVi: '"Mitigate this predicament" vừa chính xác vừa tránh được sự nhàm chán của từ "solve".',
  },
  {
    id: 'c4',
    topic: 'Xu hướng & Thay đổi (Task 1)',
    simpleWord: 'go up a lot / increase fast',
    band6Example: 'Sales of electric cars increased fast in 2022.',
    advancedCollocation: 'witness an exponential surge / experience dramatic upward momentum',
    band8Example: 'Electric vehicle adoption witnessed an exponential surge, eclipsing conventional internal combustion models.',
    explanationVi: 'Sử dụng các danh từ chỉ sự bùng nổ ("surge", "momentum") kết hợp với động từ nhận thức ("witness", "experience").',
  },
  {
    id: 'c5',
    topic: 'Ý kiến & Tranh luận (Task 2)',
    simpleWord: 'I think that / Some people say',
    band6Example: 'Some people say that money is not everything.',
    advancedCollocation: 'proponents firmly contend that / it is widely asserted that',
    band8Example: 'Proponents firmly contend that material affluence fails to correlate directly with emotional well-being.',
    explanationVi: 'Tránh dùng "say" hay "think" đơn giản; dùng các động từ học thuật như "contend", "assert", "postulate".',
  },
  {
    id: 'c6',
    topic: 'Môi trường',
    simpleWord: 'bad for the environment',
    band6Example: 'Plastic is very bad for the ocean environment.',
    advancedCollocation: 'exert detrimental ecological repercussions / deplete finite natural reserves',
    band8Example: 'Non-biodegradable polymers exert detrimental ecological repercussions on delicate marine biomes.',
    explanationVi: '"Detrimental repercussions on biomes" là tập hợp từ vựng chính xác trong chủ đề bảo vệ môi trường.',
  },
];

export interface SkillQuiz {
  id: string;
  category: 'Overview Task 1' | 'Paraphrasing' | 'Cohesion' | 'Academic Tone';
  question: string;
  context: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanationVi: string;
  }[];
}

export const SKILL_QUIZZES: SkillQuiz[] = [
  {
    id: 'q1',
    category: 'Overview Task 1',
    question: 'Đâu là câu Overview đạt chuẩn Band 8.0+ cho biểu đồ thể hiện sự tiêu thụ than đá và năng lượng mặt trời?',
    context: 'Biểu đồ cho thấy từ 2000 - 2024: Năng lượng mặt trời tăng liên tục từ 5% lên 45%, than đá giảm từ 60% xuống 20%.',
    options: [
      {
        id: 'a',
        text: 'In 2000, coal was 60% and solar was 5%, then in 2024 solar rose to 45% while coal dropped to 20%.',
        isCorrect: false,
        explanationVi: 'Sai lầm kinh điển: Đưa số liệu cụ thể vào câu Overview. Overview chỉ được nêu xu hướng khái quát, tuyệt đối không liệt kê số liệu chi tiết!',
      },
      {
        id: 'b',
        text: 'Overall, it is evident that solar energy experienced a dramatic upward trend, whereas coal consumption underwent a continuous decline throughout the timeline.',
        isCorrect: true,
        explanationVi: 'Hoàn hảo! Nêu rõ 2 xu hướng đối lập lớn nhất, sử dụng từ nối đối lập "whereas" và cụm từ học thuật "dramatic upward trend", không chứa số liệu thừa.',
      },
      {
        id: 'c',
        text: 'Overall, coal is bad for the environment so people used more solar energy instead.',
        isCorrect: false,
        explanationVi: 'Sai lầm Task 1: Tự suy đoán lý do (speculation). Task 1 chỉ miêu tả khách quan những gì biểu đồ thể hiện, không đưa ý kiến cá nhân.',
      },
    ],
  },
  {
    id: 'q2',
    category: 'Paraphrasing',
    question: 'Cách paraphrase nào xuất sắc nhất cho câu mở bài: "Many people think that university education should be free for all students"?',
    context: 'Yêu cầu mở bài IELTS Writing Task 2.',
    options: [
      {
        id: 'a',
        text: 'Many individuals think that university study must not cost money for students.',
        isCorrect: false,
        explanationVi: 'Thay từ đơn giản bằng từ đồng nghĩa tương đương nhưng câu văn vẫn mang tính văn nói ("not cost money").',
      },
      {
        id: 'b',
        text: 'It is widely argued that tertiary education ought to be fully subsidized by the state for all matriculating scholars.',
        isCorrect: true,
        explanationVi: 'Rất xuất sắc! Chuyển chủ ngữ thành "It is widely argued that", dùng "tertiary education" (đại học), "fully subsidized" (miễn phí do nhà nước trợ cấp).',
      },
      {
        id: 'c',
        text: 'University education is very good so everybody should go to school without paying cash.',
        isCorrect: false,
        explanationVi: 'Văn phong thiếu tính học thuật nghiêm trọng ("paying cash", "very good").',
      },
    ],
  },
  {
    id: 'q3',
    category: 'Academic Tone',
    question: 'Câu nào vi phạm quy tắc văn phong học thuật (Academic Register) trong bài thi IELTS?',
    context: 'Thí sinh đang viết phần thân bài Task 2 về tác hại của thức ăn nhanh.',
    options: [
      {
        id: 'a',
        text: 'Fast food is super delicious, and kids totally love it, but it makes them fat and sick.',
        isCorrect: true,
        explanationVi: 'Vi phạm nghiêm trọng: Dùng từ lóng/văn nói ("super delicious", "totally", "kids", "fat and sick"). Chuẩn học thuật: "exerts detrimental effects on childhood obesity".',
      },
      {
        id: 'b',
        text: 'Frequent consumption of ultra-processed fare is strongly correlated with elevated risks of adolescent obesity.',
        isCorrect: false,
        explanationVi: 'Đây là câu văn mẫu mực với văn phong khách quan, trung tính và chuẩn xác.',
      },
      {
        id: 'c',
        text: 'Dietary habits heavy in saturated fats inevitably compromise long-term cardiovascular health.',
        isCorrect: false,
        explanationVi: 'Câu văn học thuật chuẩn xác, không có lỗi register.',
      },
    ],
  },
];
