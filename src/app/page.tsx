import Home from "./home";

export default function Main() {
  /**
   * This component renders the homepage of 
   * the application, however, to maintain 
   * the structure of the project, the actual
   * component was shifted under home/ and was
   * imported here to avoid creating any extra
   * /home route.
   */
  return (
    <Home />
  );
}
