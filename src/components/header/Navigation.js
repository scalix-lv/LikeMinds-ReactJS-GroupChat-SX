import { Box } from "@mui/material";
import React from "react";
import { Link, Navigate } from "react-router-dom";

function Navigation() {
  const navArr = [
    {
      title: "Community",
      link: "#",
    },
    {
      title: "Market Place",
      link: "#",
    },
    {
      title: "Product hunt",
      link: "#",
    },
    {
      title: "Knowledge Base",
      link: "#",
    },
  ];
  const navigate = (link) => {};
  return (
    <>
      <div
        style={{
          margin: "0 12px",
        }}
        className="z:max-md:hidden mx-3"
      >
        {navArr.map((block, blockIndex) => {
          return (
            <Link
              style={{
                padding: "0 24px",
                textDecoration: "none",
                color: "black",
              }}
              to={block.link}
              key={blockIndex + block.title}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {block.title}
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Navigation;
