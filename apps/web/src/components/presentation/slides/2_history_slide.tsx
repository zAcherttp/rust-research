import { motion } from "motion/react";
import {
  CodeStage,
  CompareCard,
  CompareSplit,
  PlaceholderPanel,
  SlideBody,
  SlideFrame,
  SlideHeader,
  SlideSubtitle,
  SlideTitle,
} from "../slide";

export function HistoryCurseSlide() {
  const tradeoffSides = [
    {
      language: "C / C++",
      title: "Tốc độ tối đa",
      summary: "Hiệu năng thô, kiểm soát tuyệt đối, sát phần cứng.",
      accentClassName:
        "border-sky-500/25 bg-linear-to-br from-sky-500/5 via-background to-background text-sky-500 shadow-[0_24px_70px_-40px_rgba(14,165,233,0.2)]",
      eyebrowClassName: "border-sky-500/30 bg-sky-500/10 text-sky-400",
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
      accentClassName:
        "border-emerald-500/25 bg-linear-to-br from-emerald-500/5 via-background to-background text-emerald-500 shadow-[0_24px_70px_-40px_rgba(16,185,129,0.2)]",
      eyebrowClassName:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      points: [
        "Garbage Collector bảo vệ bộ nhớ",
        "Runtime can thiệp vào vòng đời dữ liệu",
        "Đổi lại: trễ hơn và ngốn RAM hơn",
      ],
    },
  ];

  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Lời nguyền Nhị phân của Khoa học Máy tính</SlideTitle>
        <SlideSubtitle>
          Tốc độ hay An toàn? Sự đánh đổi lịch sử
        </SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <div className="mt-10 flex h-full flex-col items-center gap-10">
          <div className="relative w-full max-w-5xl">
            <CompareSplit
              center={
                <div className="hidden flex-col items-center lg:flex">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border/80 bg-background">
                    <span className="font-medium text-muted-foreground text-xl uppercase">
                      VS
                    </span>
                  </div>
                </div>
              }
            >
              {tradeoffSides.map((side, index) => (
                <CompareCard
                  key={side.language}
                  revealIndex={index + 1}
                  title={side.title}
                  summary={side.summary}
                  eyebrow={side.language}
                  points={side.points}
                  className={side.accentClassName}
                  eyebrowClassName={side.eyebrowClassName}
                />
              ))}
            </CompareSplit>
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
      </SlideBody>
    </SlideFrame>
  );
}

export function HistoryDeepDiveSlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Trải nghiệm Kỹ thuật</SlideTitle>
        <SlideSubtitle>Tại sao sự cân bằng cũ lại sụp đổ?</SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <CodeStage
          filename="c_malloc.c"
          language="c"
          themeConfig="error"
          code={
            "void do_work() {\n    int *data = malloc(sizeof(int) * 100);\n    // Quên free(data) -> Rò rỉ (Memory Leak)\n    // Hoặc free() 2 lần -> Sập (Double Free)\n}"
          }
          gridClassName="mt-12 max-w-5xl grid-cols-1 lg:grid-cols-2"
          narrative={
            <>
              <h3 className="mb-3 font-semibold text-blue-400 text-xl">
                Memory Leaks & SegFaults
              </h3>
              <p>
                C/C++ cho ta quyền tự do tuyệt đối, nhưng cái giá phải trả là
                mạng sống của hệ thống.
              </p>
            </>
          }
          aside={
            <div className="flex h-full flex-col justify-center space-y-6">
              <h3 className="font-semibold text-emerald-400 text-xl">
                GC Thời gian thực (Stop-the-World)
              </h3>
              <PlaceholderPanel className="h-44 min-h-44 bg-card not-italic">
                [Placeholder: Đồ thị giật lag của Java GC]
              </PlaceholderPanel>
              <p className="text-muted-foreground text-sm">
                Java giải quyết bằng GC chạy ngầm dọn rác, tạo ra những khoảng
                trễ không thể đoán trước.
              </p>
            </div>
          }
        />
      </SlideBody>
    </SlideFrame>
  );
}
