// import { useState } from 'react';

export default function DefaultModal({ content, confirm, cancel }) {

    return (
        <div className="bg-[rgba(0,0,0,0.3)] fixed inset-0 z-50">
            <div className="modal flex h-screen justify-center items-center">
                <div className="m-5 px-10 pt-5 w-full md:w-1/3 bg-white border-2 border-primary rounded-xl ">
                    <div className="flex m-5" >{content}</div>
                    <div className="flex justify-evenly m-2">
                        <button onClick={confirm} className="btn-full">conferma</button>
                        <button onClick={cancel} className="btn-empty">indietro</button>
                    </div>

                </div>
            </div>
        </div>
    )
}


