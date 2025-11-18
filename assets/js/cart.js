
      // Format currency
      function formatRupiah(number) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
          .format(number)
          .replace("IDR", "Rp");
      }

      // Calculate totals
      function calculateTotals() {
        let totalPromo = 0;
        let totalFee = 0;
        const ongkir = 50000;

        document.querySelectorAll(".cart-item").forEach((item) => {
          const price = parseInt(item.dataset.price);
          const fee = parseInt(item.dataset.fee);
          const qty = parseInt(item.querySelector(".qty-input").value);

          const itemTotal = (price + fee) * qty;
          item.querySelector(".item-subtotal").textContent =
            formatRupiah(itemTotal);

          totalPromo += price * qty;
          totalFee += fee * qty;
        });

        const grandTotal = totalPromo + totalFee + ongkir;

        document.getElementById("totalPromo").textContent =
          formatRupiah(totalPromo);
        document.getElementById("totalFee").textContent =
          formatRupiah(totalFee);
        document.getElementById("grandTotal").textContent =
          formatRupiah(grandTotal);
      }

      // Handle quantity changes
      document.addEventListener("click", function (e) {
        const item = e.target.closest(".cart-item");
        if (!item) return;

        const input = item.querySelector(".qty-input");
        let currentQty = parseInt(input.value);

        if (e.target.closest(".qty-minus")) {
          if (currentQty > 1) {
            input.value = currentQty - 1;
            calculateTotals();
          }
        } else if (e.target.closest(".qty-plus")) {
          input.value = currentQty + 1;
          calculateTotals();
        } else if (e.target.closest(".delete-btn")) {
          if (confirm("Hapus item dari keranjang?")) {
            item.remove();
            calculateTotals();
          }
        }
      });

      // Handle manual input
      document.addEventListener("input", function (e) {
        if (e.target.classList.contains("qty-input")) {
          let value = parseInt(e.target.value);
          if (value < 1 || isNaN(value)) {
            e.target.value = 1;
          }
          calculateTotals();
        }
      });

      // Initial calculation
      calculateTotals();
