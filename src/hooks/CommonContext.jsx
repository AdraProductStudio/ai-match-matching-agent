import { createContext, useState } from "react";


const CommonContext = createContext();

export const DataProvider = ({ children }) => {

    const [fetchedPdfBlobFile, setFetchedPdfBlobFile] = useState("")

    return (
        <CommonContext.Provider value={{
            fetchedPdfBlobFile,
            setFetchedPdfBlobFile,
        }}>
            {children}
        </CommonContext.Provider>
    )
}


export default CommonContext;