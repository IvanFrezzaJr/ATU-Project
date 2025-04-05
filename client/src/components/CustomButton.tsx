import { useLocation } from "wouter-preact";

interface ActionButtonProps {
    actionType: "tradelist" | "alert" | "custom";
    customAction?: () => void;
    label: string;
}

const ActionButton = ({ actionType, customAction, label }: ActionButtonProps) => {
    const [, navigate] = useLocation();

    const handleClick = () => {
        switch (actionType) {
            case "alert":
                alert("Oferta enviada!");
                break;
            case "custom":
                customAction && customAction();
                break;
            case "tradelist":
            default:
                navigate('/tradelist');
                break;
        }
    };

    return <button onClick={handleClick}>{label}</button>;
};

export default ActionButton;
