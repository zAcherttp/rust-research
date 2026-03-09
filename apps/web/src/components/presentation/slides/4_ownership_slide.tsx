import { motion } from "motion/react";
import { CodeBlock } from "../code_block";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function OwnershipSlide() {
  return (
    <Slide>
      <SlideTitle>Ownership</SlideTitle>
      <SlideSubtitle>Cảnh sát Bộ nhớ của hệ thống</SlideSubtitle>
      <SlideContent>
        <div className="mt-12 flex w-full max-w-4xl flex-col items-center justify-center space-y-8">
          <p className="text-center text-foreground/80 text-xl leading-relaxed">
            Không tự dọn rác như C++, không có GC như Java.
            <br />
            Trình biên dịch tự chèn lệnh giải phóng bộ nhớ ngay lúc biên dịch
            đoạn mã.
          </p>

          <div className="mt-8 grid w-full gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-row items-center gap-6 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-bold text-2xl text-orange-500">
                1
              </div>
              <p className="text-xl">
                Mỗi giá trị trong Rust chỉ có một <strong>chủ (owner)</strong>{" "}
                duy nhất.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-row items-center gap-6 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-bold text-2xl text-orange-500">
                2
              </div>
              <p className="text-xl">
                Chỉ có <strong>một chủ tại một thời điểm</strong>.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-row items-center gap-6 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/20 font-bold text-2xl text-orange-500">
                3
              </div>
              <p className="text-xl">
                Khi chủ ra khỏi <strong>phạm vi (scope)</strong>, giá trị sẽ lập
                tức bị hủy (drop).
              </p>
            </motion.div>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}

export function StackHeapSlide() {
  return (
    <Slide>
      <SlideTitle>Ngăn xếp (Stack) & Đống (Heap)</SlideTitle>
      <SlideSubtitle>Bản chất lượng tử của bộ nhớ</SlideSubtitle>
      <SlideContent>
        <div className="mt-12 grid w-full max-w-5xl grid-cols-2 gap-12">
          <div className="flex w-full flex-col rounded-xl border border-border bg-muted/50 p-8">
            <h3 className="mb-6 text-center font-bold text-2xl text-foreground">
              Stack (Ngăn Xếp)
            </h3>
            <div className="flex h-56 w-full items-center justify-center rounded-xl border border-border border-dashed bg-card text-muted-foreground">
              [Placeholder: Hình ảnh Chồng Đĩa]
            </div>
            <ul className="mt-8 list-inside list-disc space-y-3 text-muted-foreground">
              <li>Nhanh chóng & Ngăn nắp</li>
              <li>Kích thước cố định (đã biết từ trước)</li>
              <li>Vào sau ra trước (LIFO)</li>
            </ul>
          </div>
          <div className="flex w-full flex-col rounded-xl border border-border bg-muted/50 p-8">
            <h3 className="mb-6 text-center font-bold text-2xl text-foreground">
              Heap (Đống)
            </h3>
            <div className="flex h-56 w-full items-center justify-center rounded-xl border border-border border-dashed bg-card text-muted-foreground">
              [Placeholder: Hình ảnh Nhà Kho Lộn Xộn]
            </div>
            <ul className="mt-8 list-inside list-disc space-y-3 text-muted-foreground">
              <li>Kích thước động & Linh hoạt</li>
              <li>Tìm chỗ trống và trả về con trỏ</li>
              <li>Chậm hơn do phải xin cấp phát</li>
            </ul>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}

export function MoveSemanticsSlide() {
  return (
    <Slide>
      <SlideTitle>Ngữ nghĩa Di chuyển (Move Semantics)</SlideTitle>
      <SlideSubtitle>
        Tiêu diệt vấn đề Use-After-Free bằng toán học Affine
      </SlideSubtitle>
      <SlideContent>
        <div className="mt-8 grid h-full w-full max-w-6xl grid-cols-[1fr_2fr] items-center gap-12">
          <div className="flex h-full flex-col justify-center space-y-8">
            <CodeBlock
              filename="move.rs"
              themeConfig="error"
              code={`let s1 = String::from("Rust");\nlet s2 = s1;\n\n// s1 bị vô hiệu hóa tĩnh!\nprintln!("{}", s1);\n// ERROR: value borrowed here after move`}
            />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thay vì sao chép toàn bộ chuỗi Heap tốn kém, Rust thực hiện{" "}
              <strong>di chuyển tĩnh (Move)</strong>.
              <br />
              <br />
              Nó chỉ chép siêu dữ liệu 24-bytes sang{" "}
              <code className="rounded bg-pink-900/30 px-1 text-pink-400">
                s2
              </code>
              , và tước quyền sở hữu của{" "}
              <code className="rounded bg-pink-900/30 px-1 text-pink-400">
                s1
              </code>{" "}
              ngay lập tức trước khi biên dịch xong.
            </p>
          </div>

          <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-border border-dashed bg-muted/50 p-8">
            <div className="space-y-4 text-center text-muted-foreground italic">
              <span className="block font-bold text-lg">
                Interactive Animation (Framer Motion)
              </span>
              <p>
                Step 1: Khối hộp <code className="text-blue-400">s1</code> rơi
                xuống Stack, bắn tia laser trỏ về{" "}
                <code className="text-orange-400">"R-u-s-t"</code> trên Heap.
              </p>
              <p>
                Step 2: Khối <code className="text-blue-400">s2</code> xuất
                hiện. Hạt siêu dữ liệu bay sang. Tia laser của s1 đứt phựt! s1
                bị gạch chéo đỏ tát vô mặt.
              </p>
              <p>
                Step 3: Tia sét đánh thẳng từ dòng lệnh{" "}
                <code className="text-red-400">println!</code> vào cái xác s1.
              </p>
            </div>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}

export function BorrowingNLLSlide() {
  return (
    <Slide>
      <SlideTitle>Borrowing & Vòng đời Phi Từ vựng (NLL)</SlideTitle>
      <SlideSubtitle>Mượn mà không tước quyền sở hữu</SlideSubtitle>
      <SlideContent>
        <div className="mt-12 grid h-full w-full max-w-5xl grid-cols-[2fr_1.5fr] items-center gap-12">
          <div className="flex h-full flex-col justify-center space-y-8">
            <CodeBlock
              filename="borrow.rs"
              themeConfig="success"
              code={`let s1 = String::from("Rust");\nlet s2 = &s1; // Mượn tham chiếu\n\nprintln!("S1: {}, S2: {}", s1, s2);\n// Mọi chuyện ổn thỏa!`}
            />
            <p className="text-foreground/80 text-sm leading-relaxed">
              Nếu lúc nào cũng di chuyển quyền sở hữu thì chẳng ai code nổi.
              Rust cho phép 'Mượn' (Borrow) bằng tham chiếu.
              <br />
              <br />
              Với bản nâng cấp <strong>Non-Lexical Lifetimes (NLL)</strong>,
              trình biên dịch dùng đồ thị luồng điều khiển tĩnh (CFG) để hiểu
              chính xác lúc nào tham chiếu tự chết ngay ở dòng cuối cùng nó được
              dùng.
            </p>
          </div>
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-border bg-muted/50 p-8 shadow-inner">
            <div className="text-center text-muted-foreground italic">
              [Placeholder: Đồ thị Control Flow Graph tĩnh hiện lên phân tích
              biến sống chết]
            </div>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}
