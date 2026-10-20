import HomePage from "./HomePage";

import React from "react"
import { BrowserRouter, Routes, Route, useNavigate, Outlet, Navigate } from "react-router-dom"

export const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="home" element={<HomePage/>}/>
                <Route path="*" element={<Navigate to={"/home"} />}/>
            </Routes>
        </BrowserRouter>
    );
};