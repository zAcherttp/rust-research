import { motion } from "motion/react";
import { CodeBlock } from "../code_block";
import { Slide, SlideContent, SlideSubtitle, SlideTitle } from "../slide";

export function OOPvsTraitsSlide() {
  return (
    <Slide>
      <SlideTitle>Mô hình OOP vs Rust Traits</SlideTitle>
      <SlideSubtitle>Nói KHÔNG với Sự Kế Thừa Lớp</SlideSubtitle>
      <SlideContent>
        <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center space-y-12">
          <p className="max-w-4xl text-center text-foreground/80 text-xl leading-relaxed">
            Nếu Smalltalk (1972) định nghĩa OOP thuần túy qua "Truyền thông
            điệp", và Java định nghĩa qua Kế thừa Lớp, thì Rust nói{" "}
            <strong className="text-red-400">KHÔNG</strong> với Kế thừa. Rust
            tách biệt toàn vẹn dữ liệu và hành vi.
          </p>

          <div className="mt-8 grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-12">
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-8">
              <div className="mb-6 flex h-32 w-full items-center justify-center rounded-lg border border-border border-dashed bg-muted/50 text-center text-muted-foreground italic">
                [Placeholder: Cây phả hệ Kế thừa sâu của Java]
              </div>
              <h3 className="font-bold text-2xl text-blue-400">
                Object-Oriented
              </h3>
              <p className="mt-4 text-center text-muted-foreground text-sm leading-snug">
                Dữ liệu gắn chặt với Hành vi.
                <br />
                Phân cấp kế thừa siêu rối rắm.
              </p>
            </div>

            <span className="font-extrabold text-3xl text-muted-foreground uppercase tracking-widest">
              VS
            </span>

            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-8">
              <div className="mb-6 flex h-32 w-full items-center justify-center rounded-lg border border-border border-dashed bg-muted/50 text-center text-muted-foreground italic">
                [Placeholder: Khối Lego lắp ghép]
              </div>
              <h3 className="font-bold text-2xl text-orange-400">
                Traits Composition
              </h3>
              <p className="mt-4 text-center text-muted-foreground text-sm leading-snug">
                Tách bạch Dữ liệu (Struct) và Hành vi (Trait). Lắp ráp như Lego.
              </p>
            </div>
          </div>
        </div>
      </SlideContent>
    </Slide>
  );
}

export function MonomorphizationSlide() {
  return (
    <Slide>
      <SlideTitle>Đa hình Tĩnh vs Động</SlideTitle>
      <SlideSubtitle>
        Monomorphization: Hiệu suất tối thượng của C
      </SlideSubtitle>
      <SlideContent>
        <div className="mt-12 grid h-full w-full max-w-6xl grid-cols-[1.5fr_1.5fr] items-center gap-12">
          <div className="flex flex-col space-y-4">
            <CodeBlock
              filename="generic.rs"
              themeConfig="normal"
              code={`// Generic function (1 bản mẫu)\nfn print_it<T: std::fmt::Display>(item: T) {\n    println!("{}", item);\n}\n\n// 2 kiểu gọi khác nhau\nprint_it(5);\nprint_it("Hello");`}
            />
          </div>
          <div className="relative flex flex-col space-y-4">
            {/* Arrow connector */}
            <div
              className="absolute top-1/2 left-[-3rem] hidden h-1 w-12 rounded-full bg-linear-to-r from-border to-orange-500 md:block"
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
          <strong className="text-green-400">
            nhanh bằng mã C thuần chủng
          </strong>
          .
        </p>
      </SlideContent>
    </Slide>
  );
}
