import React from "react"
import { BrowserRouter, Routes, Route, useNavigate, Outlet, Navigate } from "react-router-dom"

export const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="*" element={<Navigate to={"/login"} />}/>
            </Routes>
        </BrowserRouter>
    );
};