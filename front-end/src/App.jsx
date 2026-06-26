import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import { DataProvider } from "./context/DataContext";

// Admin/editor pages are code-split: public visitors never download them.
const SignIn = lazy(() => import("./pages/SignIn"));
const Edit = lazy(() => import("./pages/Edit"));
const BasicInfo = lazy(() => import("./pages/BasicInfo"));
const SocialMedia = lazy(() => import("./pages/SocialMedia"));
const Projects = lazy(() => import("./pages/Projects"));
const Education = lazy(() => import("./pages/Education"));
const Certificate = lazy(() => import("./pages/Certificate"));
const Experience = lazy(() => import("./pages/Experience"));
const Contact = lazy(() => import("./pages/Contact"));
const Setting = lazy(() => import("./pages/Setting"));
const EditProject = lazy(() => import("./pages/EditProject"));
const EditEducation = lazy(() => import("./pages/EditEducation"));
const EditCertificate = lazy(() => import("./pages/EditCertificate"));
const EditExperience = lazy(() => import("./pages/EditExperience"));

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-ink-900" />
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route element={<PrivateRoute />}>
              <Route path="/edit" element={<Edit />} />
              <Route path="/basic-info" element={<BasicInfo />} />
              <Route path="/social-media" element={<SocialMedia />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/education" element={<Education />} />
              <Route path="/certificate" element={<Certificate />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/edit-project/:projectId" element={<EditProject />} />
              <Route path="/edit-education/:educationId" element={<EditEducation />} />
              <Route path="/edit-certificate/:certificateId" element={<EditCertificate />} />
              <Route path="/edit-experience/:workId" element={<EditExperience />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </DataProvider>
  );
}
