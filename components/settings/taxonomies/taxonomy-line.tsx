import { ActivitySchema } from "../../../src/types/activity.type";
import moment from "moment";
import useTaxonomyContext from "./taxonomies-context";
import { TaxonomySchema } from "../../../src/types/taxonomy.type";

interface TaxonomyLineProps {
  tax: TaxonomySchema;
}
export default function TaxonomyLine(props: TaxonomyLineProps) {
  const { tax } = props;

  const actv = tax.active;
  const { setSelected } = useTaxonomyContext();

  function handleClick() {
    setSelected(tax.id);
  }

  return (
    <div
      className="border d-flex bg-light align-items-center"
      style={{ marginTop: -1 }}
    >
      <div className="d-flex align-items-center p-2">
        <div
          className={actv ? "bg-success" : "bg-warning"}
          style={{ width: 10, height: 10, borderRadius: 10 }}
        ></div>
      </div>
      <div className="w-100 p-2 overflow-hidden">
        <div>
          <button
            onClick={handleClick}
            className={`btn btn-sm- font-weight-bold btn-link  p-0 ${
              actv ? "" : "text-muted"
            }`}
          >
            {tax.label_pt}
          </button>
        </div>
        <div
          className="border-top_ text-xs d-flex flex-wrap overflow-hidden"
          style={{ columnGap: "1rem" }}
        >
            <div className="text-truncate" style={{width: '90%'}}>{tax.description}</div>
          
        </div>
      </div>
      <div>{/* <Button variant="outline-primary" size="sm">Ed</Button> */}</div>
    </div>
  );
}
