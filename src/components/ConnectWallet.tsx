import { Button } from "@/components/ui/button";
import { Wallet, Loader2, AlertCircle } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";

export function ConnectWallet() {
  const { isConnected, isConnecting, account, connectWallet, disconnectWallet, isCorrectNetwork, switchNetwork } = useWeb3();

  if (isConnected && isCorrectNetwork && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {account.slice(0, 6)}...{account.slice(-4)}
        </div>
        <Button 
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  if (isConnected && !isCorrectNetwork) {
    return (
      <Button 
        variant="destructive"
        size="lg"
        onClick={switchNetwork}
        className="group relative overflow-hidden"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Wrong Network
      </Button>
    );
  }

  return (
    <Button 
      variant="hero"
      size="lg"
      onClick={connectWallet}
      disabled={isConnecting}
      className="group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      {isConnecting ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <Wallet className="w-5 h-5 mr-2" />
      )}
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}