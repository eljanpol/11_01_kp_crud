import HomePage from "./HomePage";
import AddProductPage from "./AddProductPage";
import ProductList from "./ProductList";

import React from "react"
import { BrowserRouter, Routes, Route, useNavigate, Outlet, Navigate } from "react-router-dom"

export const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="home" element={<HomePage/>}/>
                <Route path="/products/new" element={<AddProductPage/>}/>
                <Route path="/products" element={<ProductList/>} />
                <Route path="*" element={<Navigate to={"/home"} />}/>
            </Routes>
        </BrowserRouter>
    );
};