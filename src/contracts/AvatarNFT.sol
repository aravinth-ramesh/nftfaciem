pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AvatarNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    ERC721Burnable,
    Ownable
{
    uint256 private tokenIdTracker = 1;

    // NFT list
    string[] public nftList;

    // NFT status
    mapping(string => bool) nftExists;

    // NFT word.
    string[] public nftWords;

    // Max token can be minted.
    uint256 public MAX_SUPPLY;

    string public baseTokenURI;

    // Event
    event welcomeToAvatar(uint256 indexed id);

    // Public mint status.
    bool public publicMintStatus = true;

    // Set wallet restriction
    bool public walletRestriction = true;

    // set wallet restriction count
    uint256 public walletRestrictionCount = 10;

    //NFT amount
    uint256 private nftAmount = 0;

    constructor(
        string memory name,
        string memory symbol,
        address ownerAddress
    ) ERC721(name, symbol) {
        transferOwnership(ownerAddress);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    // set public mint status
    function setPublicMint(bool _status) public onlyOwner {
        publicMintStatus = _status;
    }

    // set wallet restriction status and count
    function setWalletRestriction(uint256 _count, bool _status)
        public
        onlyOwner
    {
        walletRestriction = _status;
        walletRestrictionCount = _count;
    }

    // Set Max supply.
    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        MAX_SUPPLY = _maxSupply;
    }

    //set NFT amount
    function setNFTAmount(uint256 _amount) public onlyOwner {
        nftAmount = _amount;
    }

    function safeMint(
        address _to,
        string memory _tokenURI,
        string memory _nftWord
    ) external onlyOwner {
        require(!nftExists[_tokenURI]);
        nftList.push(_tokenURI);
        uint256 tokenId = tokenIdTracker;
        _safeMint(_to, tokenId);
        tokenIdTracker = tokenIdTracker + 1;
        nftExists[_tokenURI] = true;

        _setTokenURI(tokenId, _tokenURI);
        nftWords.push(_nftWord);

        emit welcomeToAvatar(tokenId);
    }

    // Public minting function.
    function publicMinting(
        address _to,
        string memory _tokenURI,
        string memory _nftWord
    ) external payable {
        // check public minting status.
        require(publicMintStatus, "Public mint is not enabled..");
        require(
            balanceOf(_to) < walletRestrictionCount,
            "Already minted your NFT."
        );
        require(!nftExists[_tokenURI]);
        require(nftAmount <= (msg.value), "Minting fee is not correct..");
        payable(owner()).transfer(msg.value);
        mintingInternal(_to, _tokenURI, _nftWord);
    }

    function mintingInternal(
        address _to,
        string memory _tokenURI,
        string memory _nftWord
    ) internal {
        nftList.push(_tokenURI);

        uint256 tokenId = tokenIdTracker;
        _safeMint(_to, tokenId);

        tokenIdTracker = tokenIdTracker + 1;
        nftExists[_tokenURI] = true;

        _setTokenURI(tokenId, _tokenURI);
        nftWords.push(_nftWord);

        emit welcomeToAvatar(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function burnToken(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
        onlyOwner
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
