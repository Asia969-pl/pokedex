import ContentContainer from "./components/shared/contentContainer/ContentContainer";
import { Outlet } from "react-router-dom"




function App() {
  return (
    <ContentContainer>
      <Outlet />
    </ContentContainer>
  );
}

export default App;