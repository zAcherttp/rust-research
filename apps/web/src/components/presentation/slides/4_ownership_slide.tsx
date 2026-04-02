import {
  CodeStage,
  CompareSplit,
  InfoPanel,
  PlaceholderPanel,
  SlideBody,
  SlideFrame,
  SlideHeader,
  SlideSubtitle,
  SlideTitle,
  StepItem,
  StepList,
} from "../slide";

export function OwnershipSlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Ownership</SlideTitle>
        <SlideSubtitle>Cảnh sát Bộ nhớ của hệ thống</SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <div className="mt-12 flex w-full max-w-4xl flex-col items-center justify-center space-y-8">
          <p className="text-center text-foreground/80 text-xl leading-relaxed">
            Không tự dọn rác như C++, không có GC như Java.
            <br />
            Trình biên dịch tự chèn lệnh giải phóng bộ nhớ ngay lúc biên dịch
            đoạn mã.
          </p>

          <StepList>
            <StepItem step="1" revealIndex={0}>
              Mỗi giá trị trong Rust chỉ có một <strong>chủ (owner)</strong> duy
              nhất.
            </StepItem>
            <StepItem step="2" revealIndex={1}>
              Chỉ có <strong>một chủ tại một thời điểm</strong>.
            </StepItem>
            <StepItem step="3" revealIndex={2}>
              Khi chủ ra khỏi <strong>phạm vi (scope)</strong>, giá trị sẽ lập
              tức bị hủy (drop).
            </StepItem>
          </StepList>
        </div>
      </SlideBody>
    </SlideFrame>
  );
}

export function StackHeapSlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Ngăn xếp (Stack) & Đống (Heap)</SlideTitle>
        <SlideSubtitle>Bản chất lượng tử của bộ nhớ</SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <CompareSplit
          className="mt-12 max-w-5xl"
          gridClassName="grid-cols-1 gap-12 lg:grid-cols-2"
        >
          <InfoPanel
            title="Stack (Ngăn Xếp)"
            revealIndex={0}
            className="h-full bg-muted/50"
          >
            <PlaceholderPanel className="h-56 min-h-56 bg-card not-italic">
              [Placeholder: Hình ảnh Chồng Đĩa]
            </PlaceholderPanel>
            <ul className="mt-8 list-inside list-disc space-y-3 text-muted-foreground">
              <li>Nhanh chóng & Ngăn nắp</li>
              <li>Kích thước cố định (đã biết từ trước)</li>
              <li>Vào sau ra trước (LIFO)</li>
            </ul>
          </InfoPanel>

          <InfoPanel
            title="Heap (Đống)"
            revealIndex={1}
            className="h-full bg-muted/50"
          >
            <PlaceholderPanel className="h-56 min-h-56 bg-card not-italic">
              [Placeholder: Hình ảnh Nhà Kho Lộn Xộn]
            </PlaceholderPanel>
            <ul className="mt-8 list-inside list-disc space-y-3 text-muted-foreground">
              <li>Kích thước động & Linh hoạt</li>
              <li>Tìm chỗ trống và trả về con trỏ</li>
              <li>Chậm hơn do phải xin cấp phát</li>
            </ul>
          </InfoPanel>
        </CompareSplit>
      </SlideBody>
    </SlideFrame>
  );
}

export function MoveSemanticsSlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Ngữ nghĩa Di chuyển (Move Semantics)</SlideTitle>
        <SlideSubtitle>
          Tiêu diệt vấn đề Use-After-Free bằng toán học Affine
        </SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <CodeStage
          filename="move.rs"
          themeConfig="error"
          code={`let s1 = String::from("Rust");\nlet s2 = s1;\n\n// s1 bị vô hiệu hóa tĩnh!\nprintln!("{}", s1);\n// ERROR: value borrowed here after move`}
          gridClassName="mt-8 max-w-6xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
          narrative={
            <>
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
            </>
          }
          aside={
            <PlaceholderPanel className="min-h-[400px] border-border bg-muted/50">
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
            </PlaceholderPanel>
          }
        />
      </SlideBody>
    </SlideFrame>
  );
}

export function BorrowingNLLSlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Borrowing & Vòng đời Phi Từ vựng (NLL)</SlideTitle>
        <SlideSubtitle>Mượn mà không tước quyền sở hữu</SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <CodeStage
          filename="borrow.rs"
          themeConfig="success"
          code={`let s1 = String::from("Rust");\nlet s2 = &s1; // Mượn tham chiếu\n\nprintln!("S1: {}, S2: {}", s1, s2);\n// Mọi chuyện ổn thỏa!`}
          gridClassName="mt-12 max-w-5xl grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]"
          narrative={
            <>
              Nếu lúc nào cũng di chuyển quyền sở hữu thì chẳng ai code nổi.
              Rust cho phép 'Mượn' (Borrow) bằng tham chiếu.
              <br />
              <br />
              Với bản nâng cấp <strong>Non-Lexical Lifetimes (NLL)</strong>,
              trình biên dịch dùng đồ thị luồng điều khiển tĩnh (CFG) để hiểu
              chính xác lúc nào tham chiếu tự chết ngay ở dòng cuối cùng nó được
              dùng.
            </>
          }
          aside={
            <PlaceholderPanel className="min-h-[300px] border-border bg-muted/50 shadow-inner">
              [Placeholder: Đồ thị Control Flow Graph tĩnh hiện lên phân tích
              biến sống chết]
            </PlaceholderPanel>
          }
        />
      </SlideBody>
    </SlideFrame>
  );
}
