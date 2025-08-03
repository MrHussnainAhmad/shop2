import React from "react";
import Container from "../common/Container";
import Logo from "../common/Logo";
import Searchbar from "./Searchbar";
import Deals from "./Deals";
import Carticon from "./Carticon";
import Account from "./Account";
import MobileMenu from "./MobileMenu";

const Header = () => {
  return (
    <header className="bg-custom-navBar text-custom-text -py-1 sm:py-3 sticky top-0 backdrop-blur-md z-50">
      <Container className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-5 -py-1">
        <div className="flex items-center justify-start gap-2 lg:gap-3" >
          <MobileMenu />
          <Logo />
        </div>
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 lg:flex-1">
          <Searchbar />
          <div className="hidden md:flex items-center gap-2 sm:gap-3 lg:gap-5">
            <Deals />
            <Carticon />
            <Account />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
