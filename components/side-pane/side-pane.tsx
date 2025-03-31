import { PropsWithChildren, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { SidePane } from "react-side-pane";
import Icon from "../ui/ionicon";



// const [open, onClose] = useReducer((p) => !p, false);

interface CustomSidePaneProps {
    open: boolean;
    onClose: () => void;
    children: any;
    onActive?: boolean;
    offset?: number;
    width?: number;
}

export default function CustomSidePane(props: PropsWithChildren<CustomSidePaneProps>) {
    
    const { open, onClose, children: C, offset, width } = props;

    return <SidePane
            open={open}
            width={width || 70}
            offset={offset || 5}
            onClose={onClose}
            disableBackdropClick={true}
            disableEscapeKeyDown={false}
            >{({onActive, ...props}) => {
                return <div className="h-100 w-100 position-absolute d-flex flex-column"> 
                    
                <div className="">
                    <Button type="button" size="sm" onClick={onClose} variant="link" style={{fontSize: '1em', lineHeight: '.8em', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <Icon name="arrow-back-outline" /> voltar
                    </Button>
                </div>
                <div className="overflow-auto p-3">
                    {C({onActive, ...props})}
                </div>
    
                </div>;
            }}</SidePane>
}