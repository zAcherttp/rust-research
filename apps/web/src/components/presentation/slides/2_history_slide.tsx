import { motion } from "motion/react";
import { CodeBlock } from "../code_block";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function HistoryCurseSlide() {
  return (
    <Slide>
      <SlideTitle>Lời nguyền Nhị phân của Khoa học Máy tính</SlideTitle>
      <SlideSubtitle>Tốc độ hay An toàn? Sự đánh đổi lịch sử</SlideSubtitle>
      <SlideContent>
        <div className="mt-12 flex h-full flex-col items-center justify-center space-y-12">
          <div className="flex w-full max-w-4xl items-center justify-between">
            {/* C/C++ Side */}
            <div className="flex flex-col items-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-blue-500 bg-blue-500/10 font-bold text-3xl text-blue-500">
                C / C++
              </div>
              <h3 className="mt-6 font-semibold text-2xl">Tốc độ tối đa</h3>
              <p className="mt-2 text-center text-muted-foreground text-sm leading-snug">
                Tự quản lý bộ nhớ
                <br />
                Nhưng 70% lỗi bảo mật
              </p>
            </div>

            {/* Seesaw Pivot */}
            <div className="flex flex-col items-center space-y-4">
              <div className="h-4 w-4 rounded-full bg-muted-foreground" />
              <div className="h-1 w-64 rotate-[-15deg] bg-muted-foreground" />
              <span className="font-bold text-muted-foreground uppercase tracking-widest">
                VS
              </span>
            </div>

            {/* Java/Python Side */}
            <div className="flex flex-col items-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 text-center font-bold text-2xl text-emerald-500">
                Java / Python
              </div>
              <h3 className="mt-6 font-semibold text-2xl">An toàn bộ nhớ</h3>
              <p className="mt-2 text-center text-muted-foreground text-sm leading-snug">
                Garbage Collector (GC)
                <br />
                Chậm & Ngốn RAM
              </p>
            </div>
          </div>
          <p className="mt-12 max-w-3xl text-center text-foreground/80 text-xl leading-relaxed">
            "Trong nhiều thập kỷ, chúng ta bị mắc kẹt. Phải chăng ta luôn phải
            đánh đổi?"
          </p>
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
