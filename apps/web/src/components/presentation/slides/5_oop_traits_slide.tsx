import { CodeBlock } from "../code_block";
import {
  CompareCard,
  CompareSplit,
  PlaceholderPanel,
  SlideBody,
  SlideFrame,
  SlideHeader,
  SlideSubtitle,
  SlideTitle,
} from "../slide";

export function OOPvsTraitsSlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Mô hình OOP vs Rust Traits</SlideTitle>
        <SlideSubtitle>Nói KHÔNG với Sự Kế Thừa Lớp</SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center space-y-12">
          <p className="max-w-4xl text-center text-foreground/80 text-xl leading-relaxed">
            Nếu Smalltalk (1972) định nghĩa OOP thuần túy qua "Truyền thông
            điệp", và Java định nghĩa qua Kế thừa Lớp, thì Rust nói{" "}
            <strong className="text-red-400">KHÔNG</strong> với Kế thừa. Rust
            tách biệt toàn vẹn dữ liệu và hành vi.
          </p>

          <CompareSplit
            className="mt-8 max-w-4xl"
            center={
              <span className="font-extrabold text-3xl text-muted-foreground uppercase tracking-widest">
                VS
              </span>
            }
          >
            <CompareCard
              title="Object-Oriented"
              summary={
                <>
                  Dữ liệu gắn chặt với Hành vi.
                  <br />
                  Phân cấp kế thừa siêu rối rắm.
                </>
              }
              media={
                <PlaceholderPanel className="mb-6 h-32 min-h-32 bg-muted/50 not-italic">
                  [Placeholder: Cây phả hệ Kế thừa sâu của Java]
                </PlaceholderPanel>
              }
              className="bg-card text-blue-400"
              revealIndex={0}
            />

            <CompareCard
              title="Traits Composition"
              summary="Tách bạch Dữ liệu (Struct) và Hành vi (Trait). Lắp ráp như Lego."
              media={
                <PlaceholderPanel className="mb-6 h-32 min-h-32 bg-muted/50 not-italic">
                  [Placeholder: Khối Lego lắp ghép]
                </PlaceholderPanel>
              }
              className="bg-card text-orange-400"
              revealIndex={1}
            />
          </CompareSplit>
        </div>
      </SlideBody>
    </SlideFrame>
  );
}

export function MonomorphizationSlide() {
  return (
    <SlideFrame>
      <SlideHeader>
        <SlideTitle>Đa hình Tĩnh vs Động</SlideTitle>
        <SlideSubtitle>
          Monomorphization: Hiệu suất tối thượng của C
        </SlideSubtitle>
      </SlideHeader>

      <SlideBody>
        <div className="mt-12 grid h-full w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)]">
          <CodeBlock
            filename="generic.rs"
            themeConfig="normal"
            code={`// Generic function (1 bản mẫu)\nfn print_it<T: std::fmt::Display>(item: T) {\n    println!("{}", item);\n}\n\n// 2 kiểu gọi khác nhau\nprint_it(5);\nprint_it("Hello");`}
          />

          <div className="relative flex flex-col space-y-4">
            <div
              className="absolute top-1/2 left-[-3rem] hidden h-1 w-12 rounded-full bg-linear-to-r from-border to-orange-500 lg:block"
              style={{ transform: "translateY(-50%)" }}
            />
            <CodeBlock
              filename="compiler_output_pseudo.rs"
              themeConfig="success"
              code={`// Monomorphized (Tự sinh ra lúc biên dịch)\nfn print_it_i32(item: i32) {\n    println!("{}", item);\n}\n\nfn print_it_str(item: &str) {\n    println!("{}", item);\n}`}
            />
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-4xl text-center text-foreground/80 text-lg leading-relaxed">
          Thay vì tốn chi phí tìm bảng hàm ảo (vtables) lúc runtime như
          Java/Smalltalk để hỗ trợ đa hình động, Rust tự động ép kiểu tĩnh và
          sinh ra các hàm chuyên biệt riêng lẻ. Mã sinh ra tĩnh 100%, chạy{" "}
          <strong className="text-green-400">nhanh bằng mã C thuần chủng</strong>.
        </p>
      </SlideBody>
    </SlideFrame>
  );
}
