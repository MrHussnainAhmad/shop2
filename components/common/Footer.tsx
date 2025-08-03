import React from "react";
import FooterTop from "./FooterTop";
import Container from "./Container";
import Link from "next/link";
import { Youtube, Github, Linkedin, Facebook, Slack } from "lucide-react";
import Logo from "./Logo";

const date = new Date();

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Discover curated furniture collections at Logo, blending style and
              comfort to elevate your living spaces.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <Youtube size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <Github size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <Slack size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Help
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop/mobiles"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Mobiles
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/appliances"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Appliances
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/smartphones"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Smartphones
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/air-conditioners"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Air Conditioners
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/washing-machine"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Washing Machine
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/kitchen-appliances"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Kitchen Appliances
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/gadget-accessories"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Gadget Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to our newsletter to receive updates and exclusive
              offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-600">
          © {date.getFullYear()}{" "}
          <span className="font-semibold">Logo</span>. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;