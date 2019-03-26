#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

class [[eosio::contract("hiworld")]] hiworld : public contract {
  public:
      using contract::contract;

      [[eosio::action]]
      void sendmsg(const std::string &msg) {
         print( "hi, ", msg );
      }
};

EOSIO_DISPATCH( hiworld, (sendmsg) )
