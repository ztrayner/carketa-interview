import { Representative } from "@/pages";
import { Stack, Input, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import copy from "copy-to-clipboard";

const RepresentativeInput = ({
  label,
  value,
  setIsCopied,
}: {
  label: string;
  value?: string;
  setIsCopied: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleCopy = (value: string) => {
    copy(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <Input
      readOnly
      placeholder={label}
      value={value || ""}
      onClick={() => {
        if (value) handleCopy(value);
      }}
      onKeyDown={(e) =>
        ["Enter", "NumpadEnter"].includes(e.key)
          ? value
            ? handleCopy(value)
            : null
          : null
      }
      sx={{ cursor: "pointer" }}
    />
  );
};

const RepresentativeDetails = ({
  representative,
}: {
  representative: Representative | null;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { name, party, district, phone, office, link } = representative || {};

  return (
    <Stack spacing={4} my={4}>
      <RepresentativeInput
        label="Name"
        value={name}
        setIsCopied={setIsCopied}
      />
      <RepresentativeInput
        label="Party"
        value={party}
        setIsCopied={setIsCopied}
      />
      <RepresentativeInput
        label="District"
        value={district}
        setIsCopied={setIsCopied}
      />
      <RepresentativeInput
        label="Phone"
        value={phone}
        setIsCopied={setIsCopied}
      />
      <RepresentativeInput
        label="Office"
        value={office}
        setIsCopied={setIsCopied}
      />
      <RepresentativeInput
        label="Link"
        value={link}
        setIsCopied={setIsCopied}
      />
      <Text color="green.500" fontSize="sm">
        {isCopied && `Copied to clipboard!`}
      </Text>
    </Stack>
  );
};

export default RepresentativeDetails;
