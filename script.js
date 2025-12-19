const contractAddress = "0x882723123bbb2b44525625282e2cd62670007202";

const contractAbi = [
  {
    "inputs": [{"internalType":"string","name":"_message","type":"string"}],
    "name":"setMessage",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getMessage",
    "outputs":[{"internalType":"string","name":"","type":"string"}],
    "stateMutability":"view",
    "type":"function"
  }
];

async function main() {
  if (!window.ethereum) {
    alert("Установите MetaMask");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // 1) Просим подключить аккаунт (важно!)
  await provider.send("eth_requestAccounts", []);

  // 2) Проверяем сеть
  const net = await provider.getNetwork();
  console.log("chainId =", net.chainId);
  if (net.chainId !== 11155111) { // Sepolia
    alert("Переключись в MetaMask на сеть Sepolia и обнови страницу (F5).");
    return;
  }

  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  document.getElementById("setMessageButton").onclick = async () => {
    try {
      const message = document.getElementById("messageInput").value;

      const tx = await contract.setMessage(message);
      console.log("tx hash:", tx.hash);

      // Ждём подтверждения в блокчейне
      await tx.wait();

      alert("Сообщение установлено!");
    } catch (e) {
      console.error(e);
      alert("Ошибка setMessage: " + (e?.data?.message || e?.message || e));
    }
  };

  document.getElementById("getMessageButton").onclick = async () => {
    try {
      const message = await contract.getMessage();
      console.log("getMessage ->", message);
      document.getElementById("messageDisplay").innerText = message;
    } catch (e) {
      console.error(e);
      alert("Ошибка getMessage: " + (e?.data?.message || e?.message || e));
    }
  };
}

main();
