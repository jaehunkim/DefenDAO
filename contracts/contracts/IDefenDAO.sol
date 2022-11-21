//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDefenDAO {
// - 컨트랙트 functionality
//     - make an offer
//     - cancel an offer
//         - partial cancel을 지원해야 함
//     - claim an NFT
//     - execute (random buy)
// 


/// structs for store
    // 0.0 0.1 0.2 ..... n.n
    // uint256이 0.1 x N의 N값을 저장한다
    // 현재 floor price가 1.5라고 하면
    // 1 => 0.1, 2 => 0.2 ..... 14 => 1.4
    // 가격 단위도 0.1eth, nft ticket 0.1개
    // 0.1가격에 내가 티켓을 5개를 사고싶다 => 0.05eth
    // 0.9가격에 내가 티켓을 1개 사고싶다 => 0.09eth
    // 0.9가격에 티켓 잔고가 9개고, 0.8가격에 티켓 잔고가 10개면 => 0.8에만 (컨트랙트가) 살수있음
    // 만약 ask bid 0.9eth 매물이 올라왔음 => 0.9가격에 있는 티켓 10개를 소각하고 => 
    // 그중에 한명에게 NFT를 넣어줌

    // 현재 floor price가 1.0eth라고 가정
    // 예를들어 0.9가격에 티켓이 100개가 있음
    // 근데 floor price가 1.1eth로 올라갔음 => 상태를 바꾸지 않아도 됨

    address immutable collectionAddress;
    uint256 curFloorPrice;
    // 
    mapping(uint256 => mapping(address => uint256)) userBalances;
    mapping(uint256 => uint256) balanceSum;
    mapping(uint256 => address[]) balanceAddrOrders;
    // claimable NFTs
    // mapping(address => )
/// struct for view


/// functions
    function makeOffer() external;

    function cancelOffer() external;

    function claimNFT() external;
    
    // 얘가 제일 힘든 친구일텐데
    // block timestamp 사용해서 구현후, VRF로 업그레이드
    function execute() external;


// - 컨트랙트 view
//     - 자신의 collection별 buy offer
    function getUserOffers(address user, uint256 price) external view returns (uint256);
//     - collection별 전체 buy offer 데이터
    function getAllOffers(uint256 price) external view returns (uint256);
}
