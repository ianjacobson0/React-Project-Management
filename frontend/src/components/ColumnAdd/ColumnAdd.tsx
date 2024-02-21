import { FaPlus } from "react-icons/fa6";

type Props = {
    createState: () => void
}

const ColumnAdd = ({ createState }: Props) => {
    return (
        <div className="column">
            <div className="box state-box add-box" onClick={(e) => createState()}>
                <FaPlus className="box-text plus" size={15} />
            </div>
        </div>
    );
}

export default ColumnAdd;