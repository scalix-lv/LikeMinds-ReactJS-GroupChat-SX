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
            <a
              style={{
                padding: "0 24px",
                textDecoration: "none",
                color: "black",
              }}
              href="javascript:void(0)"
              key={blockIndex + block.title}
              onClick={() => {
                Navigate(block.link);
              }}
            >
              {block.title}
            </a>
          );
        })}
      </Box>
    </>
  );
}

export default Navigation;
