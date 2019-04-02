#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

class [[eosio::contract("byeworld")]] byeworld : public contract {
  public:
      using contract::contract;

      [[eosio::action]]
      void sendmsg(const std::string &msg) {
         print( "bye, ", msg );
      }
};

EOSIO_DISPATCH( byeworld, (sendmsg) )
