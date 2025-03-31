import { PropsWithChildren } from "react";

interface TitleDivisorProps {
    className?: string;
    level?: 1|2;
}

export default function TitleDivisor(
  props: PropsWithChildren<TitleDivisorProps>
) {
  const { children, className, level } = props;
  return (
    <>
      <style jsx>{`
        .my-dividor {
            display: flex;
            // justify-content: center;
            align-items: center;
            gap: 1rem;
        }
        .my-dividor.level-2 {
            margin-top: 2rem;
                }
        .my-dividor span {
            color:rgb(0, 0, 0);
            text-transform: uppercase;
            white-space: nowrap;
            font-weight: 700;
        }
        .my-dividor.level-2 span {
            font-size: .8em;
            color:rgb(95, 95, 95);
        }
        .my-dividor::after {
            content: "";
            display: block;
            height: 1px;
            width: 100%;
            background: #939393;
        }   
        .my-dividor.level-2::after {
          background:rgb(207, 207, 207);
        }
      `}</style>
      <div className={`my-dividor level-${level || 1} ${className || ''}`}><span>{children}</span></div>
    </>
  );
}
