import { useEffect, useState } from "react";
import { ethers } from "ethers";

import {
  Flex,
  Box,
  Center,
  Text,
  Heading,
  Link,
  Button,
  Input,
  Spinner,
  VStack,
  Image,
} from "@chakra-ui/react";
import myEpicNft from "../utils/MyEpicNFT.json";

function Landing() {
  const CONTRACT_ADDRESS = "0x073C4B0682a48A95f9a4DBeB2cF3e0eA9C2B43A3";
  const [currAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [success, setSuccess] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      return;
    }
    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length !== 0) {
        const account = accounts[0];
        setupEventListener();

        setCurrentAccount(account);
      }
    });
    let chainId = await ethereum.request({ method: "eth_chainId" });

    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
  };

  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get metamask!");
    }

    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        setCurrentAccount(accounts[0]);
        setupEventListener();
      })
      .catch((err) => console.log(err));
  };
  const setupEventListener = async () => {
    console.log("aaaa");

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        console.log("poop");

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          setMessage("minted!");
          setLink(
            `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
          setSuccess(true);
          setLoading(false);
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      setLoading(true);
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        setMessage("⛽           paying for gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setMessage("⛏️           mining...");

        await nftTxn.wait();

        setMessage(
          `🎉  Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );

        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  });

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="flex-end"
        m="0 auto"
        w="full"
        px={10}
        py={5}
        mb={10}
      >
        {currAccount ? (
          <Button _hover={{ bg: "orange.500" }}>
            <Text>😎 {currAccount}</Text>
          </Button>
        ) : (
          <Button _hover={{ bg: "orange.500" }} onClick={connectWallet}>
            connect wallet 🏦
          </Button>
        )}
      </Flex>
      <Center
        d="flex"
        mx="auto"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        h="50vh"
        flexGrow="0"
      >
        <Flex
          flexDir="row"
          alignItems="baseline"
          justifyContent="center"
          mr={24}
        >
          <Image
            src="https://dxph5t0rbaxmg.cloudfront.net/images/cryptopunks/single/Punk5217.png"
            alt="cryptopunk"
            objectFit="contain"
            boxSize="100px"
          />
          <Heading mb={2} _hover={{ color: "orange.500" }}>
            Welcome{" "}
          </Heading>
        </Flex>

        <Text mb={10}>
          {" "}
          built by{" "}
          <Link href="https://parthm.dev" _hover={{ color: "orange.500" }}>
            parthm
          </Link>
        </Text>
        {loading ? (
          <Center>
            <VStack>
              <Spinner color="green.500" mb={2} />
              <Text>{msg}</Text>
            </VStack>
          </Center>
        ) : (
          <>
            <Button
              mt={4}
              mb={10}
              bg="green.600"
              onClick={askContractToMintNft}
              rounded="lg"
              disabled={!currAccount}
              _hover={{ bg: "orange.500" }}
            >
              mint nft
            </Button>
          </>
        )}
        {success ? (
          <Center>
            <VStack>
              <Text fontWeight="500">{msg}</Text>
              <Link
                href={link}
                isExternal={true}
                color="orange.500"
                fontWeight="500"
              >
                view on opensea!
              </Link>
            </VStack>
          </Center>
        ) : (
          <></>
        )}
      </Center>
    </>
  );
}

export default Landing;
