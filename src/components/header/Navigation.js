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
      <Box
        style={{
          margin: "0 12px",
        }}
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
      </Box>
    </>
  );
}

export default Navigation;
