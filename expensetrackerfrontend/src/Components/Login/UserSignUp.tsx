import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import CustomInputField from "../Common/CustomInputField";
import { TickCircle } from "iconsax-react";
import { apiService } from "../../Api/apiService";
import { UserSignUpRequest } from "../../types";
import useToastHook from "../../Hooks/useToastHook";
import { ThreeDots } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import useIsMobileHook from "../../Hooks/useIsMobileHook";

const UserSignUp: FunctionComponent = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [fieldError, setFieldError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const isMobile = useIsMobileHook();

  const handleFirstNameUpdate = (firstName: string) => {
    if (fieldError === "firstname") {
      setFieldError("");
    }
    setFirstName(firstName);
  };
  const handleLastNameUpdate = (lastName: string) => {
    if (fieldError === "lastname") {
      setFieldError("");
    }
    setLastName(lastName);
  };
  const handleEmailUpdate = (email: string) => {
    if (fieldError === "email") {
      setFieldError("");
    }
    setEmail(email);
  };
  const handlePasswordUpdate = (password: string) => {
    if (fieldError === "password") {
      setFieldError("");
    }
    setPassword(password);
  };
  const handleBirthDateUpdate = (birthDate: string) => {
    if (fieldError === "birthdate") {
      setFieldError("");
    }
    setBirthDate(birthDate);
  };

  const handleGenderUpdate = (gender: string) => {
    if (fieldError === "gender") {
      setFieldError("");
    }
    setGender(gender);
  };
  const { showToast } = useToastHook();

  const validateSignUp = (): boolean => {
    if (firstName === "") {
      setFieldError("firstname");
      showToast({ description: "First Name is empty", type: "error" });
      return true;
    }
    if (lastName === "") {
      setFieldError("lastname");
      showToast({ description: "Last Name is empty", type: "error" });
      return true;
    }
    if (email === "") {
      setFieldError("email");
      showToast({ description: "Email is empty", type: "error" });
      return true;
    }
    if (password === "") {
      setFieldError("password");
      showToast({ description: "Password is empty", type: "error" });
      return true;
    }
    if (birthDate === "") {
      setFieldError("birthdate");
      showToast({ description: "Birth Date is empty", type: "error" });
      return true;
    }
    if (gender === "") {
      setFieldError("gender");
      showToast({ description: "Please select Gender.", type: "error" });
      return true;
    }

    return false;
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSignUpFunction = async () => {
    if (validateSignUp()) {
      return;
    }
    if (!validateEmail(email)) {
      setFieldError("email");
      showToast({ description: "Please enter a valid email.", type: "error" });
      return;
    }
    if (!validatePassword(password)) {
      setFieldError("password");
      showToast({
        description:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    try {
      await apiService.post("/auth/register", {
        username: `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        password: password,
        gender: gender,
        birthDate: birthDate,
      });
      setIsLoading(false);
      // navigate("/login");
      // console.log(response);
    } catch (err: any) {
      showToast({
        description: err.response?.data?.message || "Something went wrong.",
        type: "error",
      });

      // navigate("/login");
      setIsLoading(false);
      // console.log(err);
    }
  };

  return (
    <VStack
      width={["90%", "70%"]}
      backgroundColor={"white"}
      justifyContent={"center"}
      alignItems={"center"}
      border={"1px solid black"}
      borderColor={"transparent"}
      borderRadius={["24px", "36px"]}
      p={["44px 32px", "48px"]}
      gap={["12px", "18px"]}
      shadow={"2xl"}
      boxShadow={"16px 16px 88px 12px rgba(0, 0, 0, 0.2)"}
    >
      <VStack
        width={"100%"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        gap={"0px"}
      >
        <Text fontSize={["lg", "2xl"]} fontWeight={"bold"}>
          Create New Account
        </Text>
        <Text fontSize={["custom-xs", "custom-sm"]} color={"brand.600"}>
          All fields are mandatory.
        </Text>
      </VStack>
      <HStack
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={["12px", "32px"]}
      >
        <CustomInputField
          placeholder={"First Name"}
          onChange={handleFirstNameUpdate}
          value={firstName}
          fieldTitle="First Name"
          fieldError={fieldError === "firstname"}
        />
        <CustomInputField
          placeholder={"Last Name"}
          onChange={handleLastNameUpdate}
          value={lastName}
          fieldTitle="Last Name"
          fieldError={fieldError === "lastname"}
        />
      </HStack>
      <CustomInputField
        placeholder={"Email"}
        onChange={handleEmailUpdate}
        fieldTitle="Email"
        value={email}
        type="email"
        fieldError={fieldError === "email"}
      />
      <CustomInputField
        placeholder={"Password"}
        onChange={handlePasswordUpdate}
        value={password}
        fieldTitle="Password"
        type="password"
        fieldError={fieldError === "password"}
      />
      <CustomInputField
        placeholder={"Birth Date"}
        onChange={handleBirthDateUpdate}
        value={birthDate}
        fieldTitle="Birth Date"
        type="date"
        fieldError={fieldError === "birthdate"}
      />

      <VStack width={"100%"}>
        <Text
          fontSize={["custom-sm", "custom-md"]}
          width={"100%"}
          color={fieldError === "gender" ? "red" : "black"}
        >
          Gender
        </Text>
        <HStack
          width={"100%"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"24px"}
        >
          <HStack
            cursor={"pointer"}
            gap={"4px"}
            onClick={() => {
              handleGenderUpdate(gender === "male" ? "" : "male");
            }}
          >
            <TickCircle
              size={isMobile ? "10px" : "14px"}
              variant={gender === "male" ? "Bold" : "Linear"}
            />
            <Text fontSize={["custom-sm", "custom-md"]}>Male</Text>
          </HStack>
          <HStack
            cursor={"pointer"}
            gap={"4px"}
            onClick={() => {
              handleGenderUpdate(gender === "female" ? "" : "female");
            }}
          >
            <TickCircle
              size={isMobile ? "14px" : "16px"}
              variant={gender === "female" ? "Bold" : "Linear"}
            />
            <Text fontSize={["custom-sm", "custom-md"]}>Female</Text>
          </HStack>
          <HStack
            cursor={"pointer"}
            gap={"4px"}
            onClick={() => {
              handleGenderUpdate(gender === "other" ? "" : "other");
            }}
          >
            <TickCircle
              size={isMobile ? "14px" : "16px"}
              variant={gender === "other" ? "Bold" : "Linear"}
            />
            <Text fontSize={["custom-sm", "custom-md"]}>Other</Text>
          </HStack>
        </HStack>
      </VStack>

      <Button
        size={["md", "lg"]}
        borderRadius={"12px"}
        px={[8, 12]}
        // width={["50%", "100%"]}
        fontSize={["custom-sm", "custom-md"]}
        onClick={handleSignUpFunction}
      >
        {isLoading ? (
          <ThreeDots color={"white"} height={"32px"} width={"32px"} />
        ) : (
          "Sign Up"
        )}
      </Button>
      <HStack
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"4px"}
      >
        <Text fontSize={["custom-sm", "custom-md"]}>
          Already have an account?
        </Text>
        <Link to={"/login"}>
          <Text
            fontSize={["custom-sm", "custom-md"]}
            color={"link.700"}
            fontWeight={"semibold"}
            cursor={"pointer"}
          >
            Log In.
          </Text>
        </Link>
      </HStack>
    </VStack>
  );
};

export default UserSignUp;
