// import { useState } from 'react';

export default function DefaultModal({ content, confirm, cancel }) {
    // const [openModal, setOpenModal] = useState('default');
    // const props = { openModal, setOpenModal };

    return (
        <>
            <div className="bg-[rgba(0,0,0,0.3)] fixed inset-0 z-50">
                <div className="modal flex h-screen justify-center items-center">
                    <div className="m-5 px-10 pt-5 w-full md:w-1/3 bg-white border-2 border-primary rounded-xl ">
                        <div className="flex m-5" >{content}</div>
                        <div className="flex justify-evenly m-2">
                            <button onClick={confirm} className="btn-full">conferma</button>
                            <button onClick={cancel} className="btn-empty">cancella</button>
                        </div>

                    </div>
                </div>
            </div>


            {/* <Modal classNameNameName='border border-primary' show={props.openModal === 'default'} onClose={() => props.setOpenModal(undefined)}>
                <Modal.Body classNameNameName=''>
                    <div classNameNameName="space-y-6">
                        {content}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button classNameNameName="m-2" color="full" onClick={() => {
                        props.setOpenModal(undefined);
                        confirm();
                    }}>Conferma</Button>
                    <Button classNameNameName="m-2" color="empty" onClick={() => {
                        props.setOpenModal(undefined);
                        cancel ? cancel() : cancel = () => { };
                    }}>Cancella</Button>
                </Modal.Footer>
            </Modal> */}
        </>
    )
}


