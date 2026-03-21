import { motion } from "motion/react";
import { CodeBlock } from "../code_block";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function HistoryCurseSlide() {
  const tradeoffSides = [
    {
      language: "C / C++",
      title: "Tốc độ tối đa",
      summary: "Hiệu năng thô, kiểm soát tuyệt đối, sát phần cứng.",
      accentClass:
        "border-sky-500/25 bg-linear-to-br from-sky-500/5 via-background to-background text-sky-500 shadow-[0_24px_70px_-40px_rgba(14,165,233,0.2)]",
      chipClass: "border-sky-500/30 bg-sky-500/10 text-sky-400",
      points: [
        "Tự quản lý bộ nhớ",
        "Không có lưới an toàn runtime",
        "70% lỗi bảo mật đến từ memory unsafety",
      ],
    },
    {
      language: "Java / Python",
      title: "An toàn bộ nhớ",
      summary: "Lập trình dễ hơn, ít tai nạn hơn, nhưng có chi phí vận hành.",
      accentClass:
        "border-emerald-500/25 bg-linear-to-br from-emerald-500/5 via-background to-background text-emerald-500 shadow-[0_24px_70px_-40px_rgba(16,185,129,0.2)]",
      chipClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      points: [
        "Garbage Collector bảo vệ bộ nhớ",
        "Runtime can thiệp vào vòng đời dữ liệu",
        "Đổi lại: trễ hơn và ngốn RAM hơn",
      ],
    },
  ];

  const [leftSide, rightSide] = tradeoffSides;

  return (
    <Slide>
      <SlideTitle>Lời nguyền Nhị phân của Khoa học Máy tính</SlideTitle>
      <SlideSubtitle>Tốc độ hay An toàn? Sự đánh đổi lịch sử</SlideSubtitle>
      <SlideContent>
        <div className="mt-10 flex h-full flex-col items-center gap-10">
          <div className="relative w-full max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] lg:items-center">
              {[leftSide, rightSide].map((side, index) => {
                const card = (
                  <motion.div
                    key={side.language}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.12, duration: 0.35 }}
                    className={`relative overflow-hidden rounded-[2rem] border p-8 ${side.accentClass}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
                    <div
                      className={`inline-flex rounded-full border px-4 py-1.5 font-semibold text-sm uppercase tracking-[0.16em] ${side.chipClass}`}
                    >
                      {side.language}
                    </div>

                    <h3 className="mt-6 font-semibold text-3xl text-foreground leading-tight">
                      {side.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-base text-muted-foreground leading-relaxed">
                      {side.summary}
                    </p>

                    <div className="mt-8 space-y-3">
                      {side.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-3 border-border/60 border-t pt-3 first:border-t-0 first:pt-0"
                        >
                          <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-current" />
                          <p className="text-base text-foreground/88 leading-relaxed">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

                if (index === 0) {
                  return card;
                }

                return (
                  <div key="tradeoff-pivot" className="contents">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.32, duration: 0.35 }}
                      className="order-first flex items-center justify-center lg:order-0"
                    >
                      <div className="hidden flex-col items-center lg:flex">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border/80 bg-background">
                          <span className="font-medium text-muted-foreground text-xl uppercase">
                            VS
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    {card}
                  </div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.35 }}
            className="max-w-3xl text-center"
          >
            <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.28em]">
              Trong nhiều thập kỷ
            </p>
            <p className="mt-4 text-2xl text-foreground/90 leading-tight lg:text-3xl">
              Phần mềm hệ thống bị kẹt giữa{" "}
              <span className="text-sky-400">tốc độ</span> và{" "}
              <span className="text-emerald-400">an toàn</span>.
              <br className="hidden sm:block" /> Liệu đó có thực sự là một lựa
              chọn bắt buộc?
            </p>
          </motion.div>
        </div>
      </SlideContent>
    </Slide>
  );
}

export function HistoryDeepDiveSlide() {
  return (
    <Slide>
      <SlideTitle>Trải nghiệm Kỹ thuật</SlideTitle>
      <SlideSubtitle>Tại sao sự cân bằng cũ lại sụp đổ?</SlideSubtitle>
      <SlideContent>
        <div className="mt-12 grid w-full max-w-5xl grid-cols-2 items-center gap-12">
          <div className="flex h-full flex-col justify-center space-y-6">
            <h3 className="font-semibold text-blue-400 text-xl">
              Memory Leaks & SegFaults
            </h3>
            <CodeBlock
              filename="c_malloc.c"
              language="c"
              themeConfig="error"
              code={
                "void do_work() {\n    int *data = malloc(sizeof(int) * 100);\n    // Quên free(data) -> Rò rỉ (Memory Leak)\n    // Hoặc free() 2 lần -> Sập (Double Free)\n}"
              }
            />
            <p className="text-muted-foreground text-sm">
              C/C++ cho ta quyền tự do tuyệt đối, nhưng cái giá phải trả là mạng
              sống của hệ thống.
            </p>
          </div>
          <div className="flex h-full flex-col justify-center space-y-6">
            <h3 className="font-semibold text-emerald-400 text-xl">
              GC Thời gian thực (Stop-the-World)
            </h3>
            <div className="flex h-44 w-full items-center justify-center rounded-xl border border-border border-dashed bg-card text-muted-foreground">
              [Placeholder: Đồ thị giật lag của Java GC]
            </div>
            <p className="text-muted-foreground text-sm">
              Java giải quyết bằng GC chạy ngầm dọn rác, tạo ra những khoảng trễ
              không thể đoán trước.
            </p>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}
