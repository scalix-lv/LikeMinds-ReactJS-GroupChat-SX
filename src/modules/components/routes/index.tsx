import { Route, Routes } from "react-router-dom";
import Switch from "../switch";

const RouteProvider: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Switch />} />
      <Route path="/:mode" element={<Switch />} />
      <Route path="/:mode/:operation" element={<Switch />} />
      <Route path="/:mode/:operation/:id" element={<Switch />} />
      <Route
        path="/:mode/:operation/:id/:replyPrivatelyVariable"
        element={<Switch />}
      />
    </Routes>
  );
};
export default RouteProvider;
