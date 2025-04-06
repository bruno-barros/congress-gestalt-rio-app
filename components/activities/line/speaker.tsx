import { useRouter } from "next/router";
import { Taxonomy } from "../../../src/resources/taxonomy";
import { TaxonomySchema } from "../../../src/types/taxonomy.type";

interface SpeakerProps {
    speaker: TaxonomySchema
}
export default function Speaker(props: SpeakerProps) {
    const { speaker: data } = props;
    const router = useRouter();
    const lang = router.locale || "pt";
    const Speaker = Taxonomy.make(data);
    return (
        <div className="d-flex align-items-center gap-2 my-2">
            {Speaker.img && <img src={Speaker.img} alt={Speaker.label} className="img-fluid rounded-circle img-ratio-1by1" style={{width: 60}} />}
            
            <div>
                <div className="text-lg font-weight-bold">{Speaker.label}</div>
                <div className="text-xs">{Speaker.getDescription(lang)}</div>
            </div>
        </div>
    )
}