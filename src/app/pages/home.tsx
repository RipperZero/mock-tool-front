import { FC, useEffect, useState } from "react";

import { Button, Image, Typography } from "antd";

import { TestMockAPIIOResObj } from "@api.mockTool";

// import logo from "@/app/assets/img/logo.png";
import { useGlobalStore } from "@/app/stores";

import { mockToolAxiosInstance } from "../apis/axios-instance";
import { testMockAPIIO } from "../apis/mock-tool";

const Home: FC = () => {
  const count = useGlobalStore((state) => state.count);
  const setCount = useGlobalStore((state) => state.setCount);

  const [testMockAPIIORes, setTestMockAPIIORes] =
    useState<TestMockAPIIOResObj>();

  const handleClick = () => {
    setCount(count + 1);
  };

  const handleClickTest = async () => {
    // testMockAPIIO()
    //   .then((res) => {
    //     console.log(res.data);
    //     setTestMockAPIIORes(res.data);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    const res = await mockToolAxiosInstance.post("/aaaa");
    console.log(res);
  };

  return (
    // <Flex height={"100vh"} justifyContent={"center"} alignItems={"center"}>
    //   <Avatar alt="zpm" src={logo} sx={{ width: "15vw", height: "15vh" }} />
    //   <Flex flexDirection={"column"}>
    //     <Typography variant="h4">
    //       {`Welcome to use react-template-next 🎉x${count}`}
    //     </Typography>
    //     <Button onClick={handleClick}>ADD count</Button>
    //     <Button onClick={handleClickOpen}>Open Dialog</Button>

    //     <Button onClick={handleClickTest}>Test Mock</Button>
    //   </Flex>
    // </Flex>

    <div className="flex h-[100vh] flex-col items-center justify-center gap-[16px]">
      <Image
        width={200}
        src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      />

      <div className="flex flex-col gap-[8px]">
        <Typography.Title>
          {`Welcome to use react-template-next 🎉x${count}`}
        </Typography.Title>

        <Button className="w-24 self-center" onClick={handleClick}>
          ADD count
        </Button>
        <Button
          className="w-24 self-center"
          type="primary"
          onClick={handleClickTest}
        >
          Test Mock API
        </Button>
      </div>
    </div>
  );
};

export { Home };
