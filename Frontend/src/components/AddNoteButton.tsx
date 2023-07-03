import React from "react";
import styleUtil from "../styles/utils.module.css";
import {FaPlus} from "react-icons/fa";
import { Button} from 'react-bootstrap';

interface ButtonClick{
    onAddButtonClicked:(state:boolean)=>void
}

const AddNoteButton = ({onAddButtonClicked}:ButtonClick)=>{

    const [width, setWidth] = React.useState(window.innerWidth);

    const breakPoint : number= 1000;

    React.useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth));
    }, []);

     return( width>breakPoint ? 
        <Button className={`my-4 ${styleUtil.blockCenter} ${styleUtil.flexCenter}`}
            onClick={()=>onAddButtonClicked(true)}>
            <FaPlus/>
            Add new note
        </Button>
    : 
        <Button className={`${styleUtil.fab} ${styleUtil.fabPosition}`}
            onClick={(e)=>{
            onAddButtonClicked(true);
            e.stopPropagation();
            }}>
            <FaPlus/>
        </Button>
    );

}

export default AddNoteButton;