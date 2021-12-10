import BaseButton from "@/components/base/BaseButton";
import Header from "@/components/base/Header";
import Input from "@/components/base/Input";
import PasswordInput from "@/components/base/PasswordInput";
import theme from "@/styles/theme";
import { Checkbox } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.kr";

const RegisterContainer = styled.div`
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0rem;
  box-sizing: border-box;
  color: ${theme.palette.primary.main};
  gap: 0.5rem;
`;

const AlignContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RegisterPage = () => {
  const [isCenter, setIsCenter] = useState(false);
  const [centerValidated, setCenterValidated] = useState(false);
  const [centerName, setCenterName] = useState("홍길동");
  const [centerNum, setCenterNum] = useState("0000000000");
  const [centerDate, setCenterDate] = useState("20000101");
  const [validateStatus, setValidateStatus] = useState("");
  const [myEmail, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const onPhoneChange = (e) => {
    setPhoneNumber(e.target.value.replaceAll(" ", ""));
    console.log(phoneNumber);
  };

  const data = JSON.stringify({
    businesses: [
      {
        b_no: centerNum,
        start_dt: centerDate,
        p_nm: centerName,
        p_nm2: "",
        b_nm: "",
        corp_no: "",
        b_sector: "",
        b_type: "",
      },
    ],
  });

  const request = {
    method: "post",
    url: "https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=w2MOw0zoOwMPgsdLpEtEKNVazsFgDfbNOxMb%2FkMMierdPUgPmj1coM%2Bgf0w%2FvA3xP6OFm8bk0GnLLUgXRoU3qQ%3D%3D",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const validation = async () =>
    await axios(request)
      .then(function (response) {
        setValidateStatus(
          JSON.stringify(response.data.data[0].valid).replaceAll('"', "")
        ); // 유효한 정보인지 출력해보기 & 일치 확인 위해 따옴표 제거
        console.log(response.data);
      })
      .catch(function () {
        alert("유효한 사업자 정보를 입력해주세요.");
      });

  const validationSchema = !isCenter
    ? yup.object({
        email: yup
          .string("이메일을 입력해주세요.")
          .email("유효한 이메일을 입력해주세요.")
          .required("이메일을 입력해주세요."),
        password: yup
          .string("비밀번호를 입력해주세요.")
          .min(8, "9자 이상의 비밀번호를 입력해주세요.")
          .required("비밀번호를 입력해주세요."),
        nickname: yup
          .string("닉네임을 입력해주세요")
          .min(3, "3자 이상의 닉네임을 입력해주세요.")
          .required("닉네임을 입력해주세요."),
      })
    : yup.object({
        email: yup
          .string("이메일을 입력해주세요.")
          .email("유효한 이메일을 입력해주세요.")
          .required("이메일을 입력해주세요."),
        password: yup
          .string("비밀번호를 입력해주세요.")
          .min(8, "9자 이상의 비밀번호를 입력해주세요.")
          .required("비밀번호를 입력해주세요."),
        nickname: yup
          .string("닉네임을 입력해주세요")
          .min(3, "3자 이상의 닉네임을 입력해주세요.")
          .required("닉네임을 입력해주세요."),
        centername: yup
          .string("기관명을 입력해주세요")
          .min(3, "3자 이상의 기관명을 입력해주세요.")
          .required("기관명을 입력해주세요."),
      });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      nickname: "",
      centername: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <Header type="plain" />
      <form onSubmit={formik.handleSubmit}>
        <RegisterContainer>
          <AlignContainer>
            <div>
              기관사용자이신가요?
              <Checkbox onChange={() => setIsCenter(!isCenter)}></Checkbox>
            </div>
            <Input
              type="Email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onKeyUp={(e) => {
                console.log(e.target.value);
                setEmail(e.target.value);
              }}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <div style={{ display: "flex", gap: ".5rem" }}>
              <Input type="Email 인증 코드" sx={{ width: "13.5rem" }} />
              <BaseButton
                type="button"
                text="인증 요청"
                width="6rem"
                height="2.4rem"
                onClick={() => alert(myEmail)}
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            {!isCenter ? (
              <Input
                type="닉네임"
                id="nickname"
                onChange={formik.handleChange}
                error={
                  formik.touched.nickname && Boolean(formik.errors.nickname)
                }
                helperText={formik.touched.nickname && formik.errors.nickname}
              />
            ) : undefined}
            <Cleave
              placeholder="010 0000 0000"
              options={{ phone: true, phoneRegionCode: "KR" }}
              onKeyUp={onPhoneChange}
              style={{
                border: `1px solid #bbbbbb`,
                borderRadius: "5px",
                height: "2.5rem",
                fontSize: "16px",
                padding: "0.7rem",
                boxSizing: "border-box",
              }}
            />
            {isCenter ? (
              <>
                <Input
                  type="기관명"
                  id="centername"
                  onChange={formik.handleChange}
                  error={
                    formik.touched.centername &&
                    Boolean(formik.errors.centername)
                  }
                  helperText={
                    formik.touched.centername && formik.errors.centername
                  }
                />
                <Input
                  type="사업자 등록 번호"
                  onChange={(e) => setCenterNum(e.target.value)}
                />
                <Input
                  type="대표자 성명"
                  onChange={(e) => setCenterName(e.target.value)}
                />
                <Input
                  type="개업 일자 / YYYYMMDD"
                  onChange={(e) => setCenterDate(e.target.value)}
                />
                <div
                  style={{
                    display: "grid",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <BaseButton
                    type="button"
                    btnType={centerValidated ? undefined : "gray_dark"}
                    text="기관 회원 인증"
                    onClick={() => {
                      validation();
                      if (validateStatus === "02")
                        alert("유효하지 않은 사업자 정보입니다.");
                      else if (validateStatus === "01") {
                        setCenterValidated(true);
                        alert("유효한 사업자 정보입니다.");
                      }
                    }}
                  />
                </div>
              </>
            ) : undefined}
            <div
              style={{
                display: "grid",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "3rem",
              }}
            >
              <BaseButton text="회원가입" width="20rem" type="submit" />
            </div>
          </AlignContainer>
        </RegisterContainer>
      </form>
    </>
  );
};

export default RegisterPage;
